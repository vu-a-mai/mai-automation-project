@echo off
REM Run Robot Framework tests with proper PYTHONPATH

cd /d %~dp0

REM Set PYTHONPATH to current directory (parent of keywords folder)
set PYTHONPATH=.

REM Run tests
robot --outputdir results tests\login.robot

pause
