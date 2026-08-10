Remove-Item -Force deploy-next-small.zip -ErrorAction SilentlyContinue
$items = Get-ChildItem -Path .next, public, src, server.js, package.json, package-lock.json, middleware.ts, next.config.ts, .cpanel.yml, .env.local | Where-Object { $_.FullName -notmatch '\\.next\\cache' }
Compress-Archive -Path $items.FullName -DestinationPath deploy-next-small.zip -Force
$size = (Get-Item deploy-next-small.zip).Length
Write-Host "SMALL_ZIP_SIZE: $size"
