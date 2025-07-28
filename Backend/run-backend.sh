#!/bin/bash

echo "Starting .NET Full Stack Backend..."
echo

echo "Checking .NET SDK..."
if ! command -v dotnet &> /dev/null; then
    echo ".NET SDK not found. Please install .NET 8 SDK."
    exit 1
fi

dotnet --version
echo

echo "Restoring NuGet packages..."
dotnet restore

echo
echo "Building the solution..."
dotnet build

echo
echo "Starting the API server..."
echo "The API will be available at: https://localhost:7001"
echo "Swagger UI will be available at: https://localhost:7001/swagger"
echo

cd FullStackApp.API
dotnet run