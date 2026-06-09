@echo off
setlocal enabledelayedexpansion

set "VERSION_DIR=versions"
set "VERSION_FILE=%VERSION_DIR%\versions.json"
set "TIMESTAMP=%date:~0,4%%date:~5,2%%date:~8,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"

if not exist "%VERSION_DIR%" (
    mkdir "%VERSION_DIR%"
)

if not exist "%VERSION_FILE%" (
    echo [] > "%VERSION_FILE%"
)

if "%1"=="backup" (
    goto :backup
) else if "%1"=="restore" (
    goto :restore
) else if "%1"=="list" (
    goto :list
) else (
    goto :help
)

:backup
set "DESCRIPTION=%~2"
if not defined DESCRIPTION set "DESCRIPTION=自动备份"

set "BACKUP_DIR=%VERSION_DIR%\v_%TIMESTAMP%"
mkdir "%BACKUP_DIR%"

xcopy /s /e /y /q "*.html" "%BACKUP_DIR%\"
xcopy /s /e /y /q "*.css" "%BACKUP_DIR%\"
xcopy /s /e /y /q "*.js" "%BACKUP_DIR%\"
xcopy /s /e /y /q "assets" "%BACKUP_DIR%\assets\"

for /f "delims=" %%a in (%VERSION_FILE%) do set "CONTENTS=%%a"
set "NEW_VERSION={\"version\":\"v_%TIMESTAMP%\",\"description\":\"%DESCRIPTION%\",\"date\":\"%date% %time%\",\"files\":[]}"

if "%CONTENTS%"=="[]" (
    echo [%NEW_VERSION%] > "%VERSION_FILE%"
) else (
    set "CONTENTS=%CONTENTS:~0,-1%"
    echo %CONTENTS%,%NEW_VERSION%] > "%VERSION_FILE%"
)

echo 备份完成: v_%TIMESTAMP%
echo 描述: %DESCRIPTION%
goto :eof

:restore
set "TARGET_VERSION=%~2"
if not defined TARGET_VERSION (
    echo 请指定要恢复的版本，例如: version.bat restore v_20240101_120000
    goto :eof
)

set "BACKUP_DIR=%VERSION_DIR%\%TARGET_VERSION%"
if not exist "%BACKUP_DIR%" (
    echo 版本不存在: %TARGET_VERSION%
    goto :eof
)

xcopy /s /e /y /q "%BACKUP_DIR%\*" ".\"

echo 已恢复版本: %TARGET_VERSION%
goto :eof

:list
echo 版本列表:
echo ==============================================
for /f "tokens=2 delims=:" %%a in ('findstr /i "version" "%VERSION_FILE%"') do (
    for /f "tokens=1 delims=," %%b in ("%%a") do (
        set "VER=%%b"
        set "VER=!VER:"=!"
        echo !VER!
    )
)
goto :eof

:help
echo 版本管理工具
echo ==============================================
echo 用法:
echo   version.bat backup [描述]    - 创建备份
echo   version.bat restore [版本号]  - 恢复指定版本
echo   version.bat list             - 列出所有版本
echo ==============================================
goto :eof