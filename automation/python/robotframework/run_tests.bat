@echo off
REM Run Robot Framework tests

cd /d %~dp0

REM Set PYTHONPATH to current directory
set PYTHONPATH=%CD%

REM Run tests in headless mode
set "HEADLESS=True"

echo Running tests in HEADLESS mode...

robot --outputdir results tests\login.robot

pause
