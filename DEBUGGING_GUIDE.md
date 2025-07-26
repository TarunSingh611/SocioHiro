# Debugging Guide for InstagramStore

This guide explains how to debug both the React frontend and Node.js backend of the InstagramStore application.

## VS Code Debug Configurations

The project includes several VS Code debug configurations located in `.vscode/launch.json`:

### Frontend Debugging (React)

1. **Debug Frontend (React)** - Launches Chrome and starts the frontend dev server
2. **Debug Frontend (React) - Attach** - Attaches to an existing Chrome instance

### Backend Debugging (Node.js)

1. **Debug Backend (Node.js)** - Launches the Node.js server with debugging enabled
2. **Debug Backend (Node.js) - Attach** - Attaches to an existing Node.js process
3. **Debug Full Stack** - Launches both frontend and backend together

### Compound Debugging

- **Debug Full Stack (Frontend + Backend)** - Runs both frontend and backend debuggers simultaneously

## How to Use the Debuggers

### Method 1: VS Code Debug Panel

1. Open VS Code
2. Go to the Debug panel (Ctrl+Shift+D)
3. Select a debug configuration from the dropdown
4. Click the green play button or press F5

### Method 2: Command Line

#### Windows Users

If you encounter "npm not found" errors on Windows, try these alternatives:

**Option A: Use the batch file**
```bash
npm run dev:windows
```

**Option B: Use PowerShell**
```bash
npm run dev:powershell
```

**Option C: Manual start**
```bash
# Terminal 1 - Start backend
cd backend
npm run debug

# Terminal 2 - Start frontend
cd frontend
npm run dev
```

#### macOS/Linux Users

```bash
# Start both servers in debug mode
npm run dev

# Or start individually
npm run debug:frontend
npm run debug:backend
```

#### Frontend Debugging

```bash
# Start frontend with debugging
cd frontend
npm run dev:debug
```

Then open Chrome with debugging enabled:
```bash
# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="C:\temp\chrome-debug"

# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug
```

#### Backend Debugging

```bash
# Start backend with debugging
cd backend
npm run debug

# Or with break on first line
npm run debug:break

# Or with nodemon for auto-restart
npm run dev:debug
```

### Method 3: Browser Developer Tools

1. Open the React app in Chrome
2. Open Developer Tools (F12)
3. Go to Sources tab
4. Set breakpoints in your React components
5. The source maps will allow you to debug the original source code

## Debugging Features

### Frontend (React)

- **Source Maps**: Enabled for better debugging experience
- **Hot Reload**: Changes are reflected immediately
- **React DevTools**: Available in browser extensions
- **Console Logging**: Use `console.log()`, `console.warn()`, `console.error()`

### Backend (Node.js)

- **Breakpoints**: Set breakpoints in VS Code or use `debugger;` statement
- **Console Logging**: Use `console.log()`, `console.warn()`, `console.error()`
- **Nodemon**: Auto-restart on file changes
- **Environment Variables**: Loaded from `.env` file

## Debugging Tips

### Frontend Debugging

1. **Set Breakpoints**: Click on line numbers in VS Code or browser dev tools
2. **Inspect State**: Use React DevTools to inspect component state
3. **Network Tab**: Monitor API calls in browser dev tools
4. **Console Logging**: Add `console.log()` statements for debugging

```javascript
// Example debugging in React component
function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    console.log('Component mounted');
    fetchData().then(result => {
      console.log('Data fetched:', result);
      setData(result);
    });
  }, []);

  return <div>{/* component JSX */}</div>;
}
```

### Backend Debugging

1. **Set Breakpoints**: Click on line numbers in VS Code
2. **Use debugger statement**: Add `debugger;` in your code
3. **Console Logging**: Add `console.log()` statements
4. **Inspect Variables**: Use the debug console in VS Code

```javascript
// Example debugging in Express route
router.get('/api/content', async (req, res) => {
  console.log('Request received:', req.query);
  debugger; // This will pause execution

  try {
    const result = await getContent(req.user._id);
    console.log('Content fetched:', result);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

## Common Debugging Scenarios

### API Issues

1. Check Network tab in browser dev tools
2. Verify request/response data
3. Check backend logs for errors
4. Use Postman or similar tool to test APIs directly

### State Management Issues

1. Use React DevTools to inspect state
2. Add console logs in useEffect hooks
3. Check Zustand store state in browser console

### Database Issues

1. Check MongoDB connection in backend logs
2. Verify environment variables
3. Test database queries directly

### Authentication Issues

1. Check session/token storage
2. Verify authentication middleware
3. Check browser cookies/localStorage

## Environment Setup

Make sure you have the following environment variables set up:

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000
VITE_DEBUG=true
```

## Troubleshooting

### Debugger Not Attaching

1. Check if the correct ports are available (9222 for Chrome, 9229 for Node.js)
2. Verify the debug configuration in VS Code
3. Make sure the application is running

### Source Maps Not Working

1. Ensure source maps are enabled in Vite config
2. Check browser dev tools settings
3. Clear browser cache

### Breakpoints Not Hitting

1. Verify the code is actually running
2. Check if the file path matches
3. Ensure the debugger is properly attached

### Windows-Specific Issues

#### npm not found error

If you get "spawn npm ENOENT" error on Windows:

1. **Use the batch file**: `npm run dev:windows`
2. **Use PowerShell**: `npm run dev:powershell`
3. **Check PATH**: Make sure npm is in your system PATH
4. **Use full path**: Try using the full path to npm

#### Alternative solutions:

```bash
# Use npx instead of npm
npx vite

# Use yarn if available
yarn dev

# Use the full path to npm
"C:\Program Files\nodejs\npm.cmd" run dev
```

#### PowerShell Execution Policy

If PowerShell scripts are blocked:

```powershell
# Run as administrator and set execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Additional Resources

- [VS Code Debugging Documentation](https://code.visualstudio.com/docs/editor/debugging)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Node.js Debugging](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
