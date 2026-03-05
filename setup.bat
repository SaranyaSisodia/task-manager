@echo off
echo ============================================
echo   TaskFlow - Automated Setup Script
echo ============================================
echo.

echo [1/6] Setting up Backend...
cd backend

echo Installing backend dependencies...
call npm install

echo Copying .env file...
if not exist .env copy .env.example .env

echo Generating Prisma client...
call npx prisma generate

echo Running database migrations...
call npx prisma migrate dev --name init

echo Backend setup complete!
cd ..

echo.
echo [2/6] Setting up Frontend...
cd frontend

echo Installing frontend dependencies...
call npm install

echo Frontend setup complete!
cd ..

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the project, open TWO terminals:
echo.
echo   Terminal 1 (Backend):
echo     cd backend
echo     npm run dev
echo.
echo   Terminal 2 (Frontend):
echo     cd frontend  
echo     npm run dev
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
