@echo off
rem skytalix UCI engine launcher for Windows. Point a chess GUI at this file.
rem UNTESTED: this file has not been run on Windows.
setlocal
set "ENGINE=%~dp0..\dist\uci.js"
if not exist "%ENGINE%" goto nobuild
set "NODE=node"
where node >nul 2>nul && goto run
set "NODE=%ProgramFiles%\nodejs\node.exe"
if not exist "%NODE%" goto nonode
:run
"%NODE%" "%ENGINE%" %*
exit /b %ERRORLEVEL%
:nobuild
echo skytalix-uci: dist\uci.js is missing; in the clone, run npm install, then run npm run build 1>&2
exit /b 1
:nonode
echo skytalix-uci: node not found; install Node.js 22.18 or later, or put node on the PATH 1>&2
exit /b 1
