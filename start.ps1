# Start MoodBrew Application

Write-Host "Starting MoodBrew..." -ForegroundColor Cyan

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "Backend API:  http://localhost:3001"
Write-Host "Frontend App: http://localhost:5173"
Write-Host ""
Write-Host "Press Ctrl+C in each terminal window to stop servers"
