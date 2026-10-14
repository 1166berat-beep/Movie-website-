@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js kurulu degil. https://nodejs.org adresinden LTS surumunu kurun.
  pause
  exit /b
)
set /a PORT=10000 + %RANDOM% %% 9000
echo.
echo ONEMLI: Daha once acilmis baska bir test-baslat.bat penceresi varsa ONU KAPATIN,
echo yoksa tarayici eski surumu gosterebilir.
echo.
echo Site aciliyor: http://localhost:%PORT%   (kapatmak icin bu pencereyi kapatin)
start "" cmd /c "timeout /t 3 >nul & start http://localhost:%PORT%/"
npx --yes serve -l %PORT% --no-clipboard --config serve.json .
pause
