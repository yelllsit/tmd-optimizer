#!/usr/bin/env bash
set -e

echo "Installing dependencies..."
pip install pynput pyinstaller

echo "Building executable..."
pyinstaller --onefile --noconsole --name "JitterAim" jitter_aim.py

echo ""
echo "Done! Find JitterAim in the dist/ folder."
