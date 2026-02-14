@echo off
REM Run Robot Framework tests on Windows

cd /d %~dp0

REM Set PYTHONPATH to current directory
set PYTHONPATH=%CD%

echo ==========================================
echo  Running Robot Framework Tests
echo ==========================================
echo.
echo Screenshots will be saved to:
echo   test-output/^<timestamp^>/^<browser^>/^<test^>/
echo.

REM Run tests
robot --outputdir results tests\web\

echo.
echo ==========================================
echo  Tests Complete!
echo ==========================================
echo.
echo Check test-output/ for organized screenshots
echo.

pause
