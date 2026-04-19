# Start Scientific Calculator
Write-Host "Starting Scientific Calculator..." -ForegroundColor Green

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "backend"
    node server.js
}

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "frontend"
    python -m http.server 8000
}

Write-Host ""
Write-Host "Backend server: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Frontend server: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Health check: http://localhost:3001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop servers..." -ForegroundColor Red

# Wait for user input to stop
try {
    Read-Host
} finally {
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob
    Remove-Job $backendJob, $frontendJob
}