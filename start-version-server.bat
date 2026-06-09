@echo off
echo ========================================
echo 版本管理服务器启动中...
echo ========================================
echo.
echo 服务器地址: http://localhost:3000
echo 版本管理界面: http://localhost:3000/version-manager.html
echo.
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

node version-server.js

pause