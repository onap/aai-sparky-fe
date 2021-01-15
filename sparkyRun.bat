@echo OFF
ECHO. ******Running Sparky******
call gulp build --max-old-space-size=8192
call gulp --max-old-space-size=8192
