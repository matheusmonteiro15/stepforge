@echo off
title StepForge Web - Frontend
echo ======================================================
echo           STEPFORGE - WEB FRONTEND
echo ======================================================
echo.
cd /d "%~dp0web"
echo [1/1] Iniciando servidor de desenvolvimento Vite...
echo.
echo DICA: Voce pode fechar o VS Code para economizar RAM.
echo.
call npm run dev
pause
