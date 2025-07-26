# PowerShell script to start InstagramStore in debug mode
# Run this script in PowerShell: .\debug-start.ps1

Write-Host "🚀 Starting InstagramStore in debug mode..." -ForegroundColor Green
Write-Host ""

# Check if .env files exist
$backendEnvPath = Join-Path $PSScriptRoot "backend\.env"
$frontendEnvPath = Join-Path $PSScriptRoot "frontend\.env"

if (-not (Test-Path $backendEnvPath)) {
    Write-Host "⚠️  Warning: backend/.env file not found" -ForegroundColor Yellow
    Write-Host "   Please create backend/.env with your configuration" -ForegroundColor Yellow
}

if (-not (Test-Path $frontendEnvPath)) {
    Write-Host "⚠️  Warning: frontend/.env file not found" -ForegroundColor Yellow
    Write-Host "   Please create frontend/.env with your configuration" -ForegroundColor Yellow
}

# Function to start a process
function Start-DebugProcess {
    param(
        [string]$Name,
        [string]$Command,
        [string[]]$Args,
        [string]$WorkingDir,
        [hashtable]$EnvVars = @{}
    )

    Write-Host "📦 Starting $Name..." -ForegroundColor Cyan

    $processArgs = @{
        FilePath = $Command
        ArgumentList = $Args
        WorkingDirectory = Join-Path $PSScriptRoot $WorkingDir
        NoNewWindow = $true
        RedirectStandardOutput = $true
        RedirectStandardError = $true
        UseShellExecute = $false
    }

    # Set environment variables
    $envVarsCopy = $EnvVars.Clone()
    $envVarsCopy["NODE_ENV"] = "development"

    foreach ($key in $envVarsCopy.Keys) {
        $processArgs["EnvironmentVariables"] = @{}
        $processArgs["EnvironmentVariables"][$key] = $envVarsCopy[$key]
    }

    try {
        $process = Start-Process @processArgs -PassThru

        # Handle output
        $process.StandardOutput.DataReceived += {
            if ($EventArgs.Data) {
                Write-Host "[$Name] $($EventArgs.Data)" -ForegroundColor White
            }
        }

        $process.StandardError.DataReceived += {
            if ($EventArgs.Data) {
                $message = $EventArgs.Data.Trim()
                if ($message -match "Debugger listening|Debugger attached") {
                    Write-Host "[$Name] $message" -ForegroundColor Green
                } else {
                    Write-Host "[$Name] ERROR: $message" -ForegroundColor Red
                }
            }
        }

        $process.BeginOutputReadLine()
        $process.BeginErrorReadLine()

        return $process
    }
    catch {
        Write-Host "[$Name] Failed to start: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Message -match "ENOENT") {
            Write-Host "[$Name] Command not found: $Command" -ForegroundColor Red
            Write-Host "[$Name] Please make sure $Command is installed and in your PATH" -ForegroundColor Red
        }
        return $null
    }
}

# Start backend in debug mode
$backendProcess = Start-DebugProcess -Name "Backend" -Command "node" -Args @("--inspect=9229", "src/server.js") -WorkingDir "backend" -EnvVars @{DEBUG = "true"}

if ($backendProcess) {
    Write-Host "✅ Backend started successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start backend" -ForegroundColor Red
    exit 1
}

# Wait a bit for backend to start, then start frontend
Start-Sleep -Seconds 3

$frontendProcess = Start-DebugProcess -Name "Frontend" -Command "npm" -Args @("run", "dev") -WorkingDir "frontend" -EnvVars @{VITE_DEBUG = "true"}

if ($frontendProcess) {
    Write-Host "✅ Frontend started successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to start frontend" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔗 Debug URLs:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend:  http://localhost:3000" -ForegroundColor White
Write-Host "   Backend Debug: http://localhost:9229" -ForegroundColor White
Write-Host ""
Write-Host "🎯 VS Code Debug Configurations:" -ForegroundColor Yellow
Write-Host "   - Debug Frontend (React)" -ForegroundColor White
Write-Host "   - Debug Backend (Node.js)" -ForegroundColor White
Write-Host "   - Debug Full Stack (Frontend + Backend)" -ForegroundColor White
Write-Host ""
Write-Host "📖 For more information, see DEBUGGING_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
Write-Host "⏹️  Press Ctrl+C to stop all servers" -ForegroundColor Red
Write-Host ""

# Handle process termination
$cleanup = {
    Write-Host ""
    Write-Host "🛑 Shutting down debug servers..." -ForegroundColor Yellow
    if ($backendProcess -and -not $backendProcess.HasExited) {
        $backendProcess.Kill()
    }
    if ($frontendProcess -and -not $frontendProcess.HasExited) {
        $frontendProcess.Kill()
    }
    exit 0
}

# Register cleanup handlers
Register-EngineEvent PowerShell.Exiting -Action $cleanup

try {
    # Wait for processes
    while ($backendProcess -and -not $backendProcess.HasExited -and $frontendProcess -and -not $frontendProcess.HasExited) {
        Start-Sleep -Seconds 1
    }
}
finally {
    & $cleanup
}
