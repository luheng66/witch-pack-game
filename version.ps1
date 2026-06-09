param(
    [string]$Action = "help",
    [string]$Description = "自动备份",
    [string]$Version = ""
)

$versionDir = "versions"
$versionFile = "$versionDir/versions.json"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

if (-not (Test-Path $versionDir)) {
    New-Item -ItemType Directory -Path $versionDir | Out-Null
}

if (-not (Test-Path $versionFile)) {
    @() | ConvertTo-Json | Set-Content $versionFile -Encoding utf8
}

function Backup {
    $backupDir = "$versionDir/v_$timestamp"
    New-Item -ItemType Directory -Path $backupDir | Out-Null
    
    Copy-Item -Path "*.html" -Destination $backupDir -Force
    Copy-Item -Path "*.css" -Destination $backupDir -Force
    Copy-Item -Path "*.js" -Destination $backupDir -Force
    Copy-Item -Path "assets" -Destination $backupDir -Recurse -Force
    
    $versions = Get-Content $versionFile -Raw | ConvertFrom-Json
    $newVersion = @{
        version = "v_$timestamp"
        description = $Description
        date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    $versions += $newVersion
    $versions | ConvertTo-Json | Set-Content $versionFile -Encoding utf8
    
    Write-Host "备份完成: v_$timestamp"
    Write-Host "描述: $Description"
}

function Restore {
    if (-not $Version) {
        Write-Host "请指定要恢复的版本，例如: .\version.ps1 -Action restore -Version v_20240101_120000"
        return
    }
    
    $backupDir = "$versionDir/$Version"
    if (-not (Test-Path $backupDir)) {
        Write-Host "版本不存在: $Version"
        return
    }
    
    Copy-Item -Path "$backupDir/*" -Destination "." -Recurse -Force
    Write-Host "已恢复版本: $Version"
}

function List {
    Write-Host "版本列表:"
    Write-Host "=============================================="
    $versions = Get-Content $versionFile -Raw | ConvertFrom-Json
    foreach ($v in $versions) {
        Write-Host "$($v.version) - $($v.date) - $($v.description)"
    }
}

function Help {
    Write-Host "版本管理工具"
    Write-Host "=============================================="
    Write-Host "用法:"
    Write-Host "  .\version.ps1 -Action backup -Description '描述'"
    Write-Host "  .\version.ps1 -Action restore -Version v_20240101_120000"
    Write-Host "  .\version.ps1 -Action list"
    Write-Host "=============================================="
}

switch ($Action) {
    "backup" { Backup }
    "restore" { Restore }
    "list" { List }
    default { Help }
}