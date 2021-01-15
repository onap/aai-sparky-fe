@echo OFF
ECHO. ***********************************
ECHO. ******Installing Sparky************
call npm install
ECHO. ******Running Sparky***************
call gulp build --max-old-space-size=8192
call gulp --max-old-space-size=8192
