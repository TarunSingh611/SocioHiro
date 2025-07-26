#!/usr/bin/env node

/**
 * Quick debug start script for InstagramStore
 * This script starts both frontend and backend in debug mode
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting InstagramStore in debug mode...\n');

// Check if .env files exist
const backendEnvPath = path.join(__dirname, 'backend', '.env');
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');

if (!fs.existsSync(backendEnvPath)) {
  console.log('⚠️  Warning: backend/.env file not found');
  console.log('   Please create backend/.env with your configuration');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('⚠️  Warning: frontend/.env file not found');
  console.log('   Please create frontend/.env with your configuration');
}

// Function to start a process
function startProcess(name, command, args, cwd, env = {}) {
  console.log(`📦 Starting ${name}...`);

  // Use npm.cmd on Windows, npm on other platforms
  const isWindows = process.platform === 'win32';
  const npmCommand = isWindows ? 'npm.cmd' : 'npm';

  // Use the correct command
  const actualCommand = command === 'npm' ? npmCommand : command;

  const child = spawn(actualCommand, args, {
    cwd: path.join(__dirname, cwd),
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_ENV: 'development',
      ...env
    },
    shell: isWindows // Use shell on Windows for better compatibility
  });

  child.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  child.stderr.on('data', (data) => {
    // Don't treat debugger messages as errors
    const message = data.toString().trim();
    if (message.includes('Debugger listening') || message.includes('Debugger attached')) {
      console.log(`[${name}] ${message}`);
    } else {
      console.error(`[${name}] ERROR: ${message}`);
    }
  });

  child.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  child.on('error', (error) => {
    console.error(`[${name}] Failed to start:`, error.message);
    if (error.code === 'ENOENT') {
      console.error(`[${name}] Command not found: ${actualCommand}`);
      console.error(`[${name}] Please make sure ${command} is installed and in your PATH`);
    }
  });

  return child;
}

// Start backend in debug mode
const backendProcess = startProcess(
  'Backend',
  'node',
  ['--inspect=9229', 'src/server.js'],
  'backend',
  { DEBUG: 'true' }
);

// Wait a bit for backend to start, then start frontend
setTimeout(() => {
  const frontendProcess = startProcess(
    'Frontend',
    'npm',
    ['run', 'dev'],
    'frontend',
    { VITE_DEBUG: 'true' }
  );

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down debug servers...');
    backendProcess.kill('SIGINT');
    frontendProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down debug servers...');
    backendProcess.kill('SIGTERM');
    frontendProcess.kill('SIGTERM');
    process.exit(0);
  });

}, 2000);

console.log('\n🔗 Debug URLs:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend:  http://localhost:3000');
console.log('   Backend Debug: http://localhost:9229');
console.log('\n🎯 VS Code Debug Configurations:');
console.log('   - Debug Frontend (React)');
console.log('   - Debug Backend (Node.js)');
console.log('   - Debug Full Stack (Frontend + Backend)');
console.log('\n📖 For more information, see DEBUGGING_GUIDE.md');
console.log('\n⏹️  Press Ctrl+C to stop all servers\n');
