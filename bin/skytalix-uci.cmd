@echo off
rem skytalix UCI engine launcher for Windows. Point a chess GUI at this file.
rem UNTESTED: this file has not been run on Windows.
setlocal
set "ENGINE=%~dp0..\dist\uci.js"
if not exist "%ENGINE%" goto nobuild
set "NODE=node"
where node >nul 2>nul && goto run
if exist "%ProgramW6432%\nodejs\node.exe" set "NODE=%ProgramW6432%\nodejs\node.exe" & goto run
set "NODE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE%" goto nonode
:run
"%NODE%" "%ENGINE%" %*
exit /b %ERRORLEVEL%
:nobuild
>&2 echo skytalix-uci: dist\uci.js is missing; in the clone, run npm install, then run npm run build
exit /b 1
:nonode
>&2 echo skytalix-uci: node not found; install Node.js 22.18 or later, or put node on the PATH
exit /b 1
