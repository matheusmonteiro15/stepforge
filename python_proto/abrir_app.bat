@echo off
echo Iniciando AppAcademia Prototype...
python main.py
if %errorlevel% neq 0 (
    echo.
    echo Ocorreu um erro ao abrir o app. Certifique-se de que o Python e o Flet estão instalados.
    pause
)
