@echo off
echo Starting .NET Full Stack Backend...
echo.

echo Checking .NET SDK...
dotnet --version
if %ERRORLEVEL% NEQ 0 (
    echo .NET SDK not found. Please install .NET 8 SDK.
    pause
    exit /b 1
)

echo.
echo Restoring NuGet packages...
dotnet restore

echo.
echo Building the solution...
dotnet build

echo.
echo Starting the API server...
echo The API will be available at: https://localhost:7001
echo Swagger UI will be available at: https://localhost:7001/swagger
echo.

cd FullStackApp.API
dotnet run

pause