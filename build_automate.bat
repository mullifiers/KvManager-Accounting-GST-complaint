@echo off
call  npm run dist
copy /s /q /e /y   D:\Server\projects\Mullbox\views\taskpool\python_bindings\guessit-api.exe D:\Server\projects\Mullbox\dist\win-ia32-unpacked\resources\app.asar.unpacked\views\taskpool\python_bindings\guessit-api.exe
exit
 
