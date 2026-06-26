@echo off
echo =======================================================
echo Instalando Tarea Programada para Sincronizador de Airbnb
echo =======================================================
echo.
echo Este script creara una tarea en el Programador de Tareas de Windows
echo para ejecutar la sincronizacion automatica cada 30 minutos.
echo.

:: Get current directory
set "project_dir=%~dp0"
:: Remove trailing backslash
set "project_dir=%project_dir:~0,-1%"
:: Get parent folder (project root)
for %%I in ("%project_dir%") do set "root_dir=%%~dpI"
set "root_dir=%root_dir:~0,-1%"

echo Directorio del proyecto: %root_dir%
echo.

:: Create the scheduled task
schtasks /create /tn "AirbnbSync_Cordoba5579" /tr "cmd.exe /c cd /d %root_dir% && python scripts/sync_airbnb.py" /sc minute /mo 30 /f

if %errorlevel% equ 0 (
    echo.
    echo =======================================================
    echo ✅ ¡Tarea programada creada exitosamente!
    echo Sincronizara tu web con Airbnb cada 30 minutos en background.
    echo =======================================================
) else (
    echo.
    echo =======================================================
    echo ❌ Ocurrio un error al crear la tarea programada.
    echo Asegurate de ejecutar este archivo como Administrador.
    echo =======================================================
)
pause
