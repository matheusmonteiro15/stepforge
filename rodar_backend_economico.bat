@echo off
title StepForge Backend - Modo Economico
echo ======================================================
echo           STEPFORGE - BACKEND (MODO ECO)
echo ======================================================
echo.
echo [1/2] Entrando na pasta backend e compilando...
cd /d "%~dp0backend"
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Falha na compilacao. Verifique os erros acima.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/2] Inciando servidor em modo PRODUCAO (Mais leve)...
echo Servidor rodando em http://localhost:3000
echo.
echo DICA: Voce pode fechar o VS Code para economizar RAM.
echo Pressione Ctrl+C duas vezes para encerrar.
echo.
call npm run start:prod
pause
