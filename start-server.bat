@echo off
cd /d "%~dp0"
set PORT=8081
node static-server.js
pause
