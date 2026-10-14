@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js kurulu degil. https://nodejs.org adresinden LTS surumunu kurun, sonra tekrar calistirin.
  pause
  exit /b
)
if not exist anahtarlar\private.pem (
  echo Ilk kurulum: gizli anahtar uretiliyor...
  node tools\make-license.mjs init
)
echo.
echo Alan adlarini virgulle yazin, PORT YAZMAYIN. Ornek: siteniz.com,www.siteniz.com
echo Bos birakirsaniz sadece yerel test icin localhost,127.0.0.1 yazilir.
set /p DOMAINS=Alan adlari: 
if "%DOMAINS%"=="" set DOMAINS=localhost,127.0.0.1
set /p DAYS=Gecerlilik gun sayisi (bos = 365, 0 = suresiz): 
if "%DAYS%"=="" set DAYS=365
node tools\make-license.mjs issue --domains "%DOMAINS%" --days %DAYS%
echo.
echo license.js hazir. Siteye yuklenecek dosyalar: index.html, ui.js, loader.js, app.js, license.js
pause
