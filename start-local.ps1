param(
    [switch]$RestoreData
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"
$archivePath = Join-Path $projectRoot "onlinecloth.archive.gz"
$mongoRestoreExe = Join-Path $projectRoot "tools\mongodb-database-tools-windows-x86_64-100.10.0\bin\mongorestore.exe"
$mongoToolsZip = Join-Path $projectRoot "mongodb-database-tools.zip"
$mongoToolsUrl = "https://fastdl.mongodb.org/tools/db/mongodb-database-tools-windows-x86_64-100.10.0.zip"

Write-Host "Project root: $projectRoot"

if (-not (Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue)) {
    throw "MongoDB service is not installed on this machine."
}

$mongoService = Get-Service -Name "MongoDB"
if ($mongoService.Status -ne "Running") {
    Write-Host "Starting MongoDB service..."
    Start-Service -Name "MongoDB"
}

if (-not (Test-Path $mongoRestoreExe)) {
    Write-Host "MongoDB Database Tools not found locally. Downloading..."
    Invoke-WebRequest -Uri $mongoToolsUrl -OutFile $mongoToolsZip
    Expand-Archive -Path $mongoToolsZip -DestinationPath (Join-Path $projectRoot "tools") -Force
}

if ($RestoreData) {
    if (-not (Test-Path $archivePath)) {
        throw "Archive file not found: $archivePath"
    }

    Write-Host "Restoring MongoDB data..."
    & $mongoRestoreExe --uri "mongodb://127.0.0.1:27017" --archive="$archivePath" --gzip --drop
} else {
    Write-Host "Skipping MongoDB restore. Use '.\start-local.ps1 -RestoreData' to restore from archive."
}

$backendPortInUse = Get-NetTCPConnection -LocalPort 4000 -State Listen -ErrorAction SilentlyContinue
if ($backendPortInUse) {
    Write-Host "Backend port 4000 is already in use, skipping backend start."
} else {
    Write-Host "Starting backend in a new window..."
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$backendDir'; npm run server"
    )
}

$frontendPortInUse = Get-NetTCPConnection -LocalPort 5174 -State Listen -ErrorAction SilentlyContinue
if ($frontendPortInUse) {
    Write-Host "Frontend port 5174 is already in use, skipping frontend start."
} else {
    Write-Host "Starting frontend in a new window..."
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd '$frontendDir'; npm run dev -- --host 127.0.0.1 --port 5174"
    )
}

Write-Host "Done. Backend: http://localhost:4000 | Frontend: http://127.0.0.1:5174"
