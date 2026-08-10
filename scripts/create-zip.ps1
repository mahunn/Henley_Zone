$files = Get-ChildItem -Path .next, public, src, server.js, package.json, package-lock.json, middleware.ts, next.config.ts, .cpanel.yml, .env.local | Where-Object { $_.FullName -notmatch '\\.next\\cache' }
Compress-Archive -Path $files.FullName -DestinationPath henleyzone-update.zip -Force
$size = (Get-Item henleyzone-update.zip).Length
Write-Host "DONE_SIZE: $size"
