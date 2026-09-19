@echo off
cd /d "%~dp0"
echo Website preview: http://127.0.0.1:4173/
echo Keep this window open while viewing the website.
echo Press Ctrl+C to stop.
python scripts\serve_preview.py --port 4173 --bind 127.0.0.1
pause
