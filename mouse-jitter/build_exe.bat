@echo off
echo Installing dependencies...
pip install pynput pyinstaller

echo Building executable...
pyinstaller --onefile --noconsole --name "JitterAim" jitter_aim.py

echo.
echo Done! Find JitterAim.exe in the dist\ folder.
pause
