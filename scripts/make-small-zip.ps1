Add-Type -AssemblyName System.IO.Compression.FileSystem

$zipPath = Join-Path (Get-Location).Path "cpanel-deploy-small.zip"
if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

$items = @('.next', 'public', 'src', 'data', 'server.js', 'package.json', 'package-lock.json', 'middleware.ts', 'next.config.ts', '.cpanel.yml', '.env.local', 'cache-handler.js')

foreach ($item in $items) {
    if (Test-Path $item -PathType Leaf) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $item, $item)
    } elseif (Test-Path $item -PathType Container) {
        $files = Get-ChildItem -Path $item -Recurse | Where-Object { 
            -not $_.PSIsContainer -and 
            $_.FullName -notmatch '[\\/]\.next[\\/](cache|dev)' 
        }
        foreach ($file in $files) {
            $relPath = $file.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/')
            [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relPath)
        }
    }
}
$zip.Dispose()
$sizeMB = ((Get-Item $zipPath).Length / 1MB).ToString("0.00")
Write-Host "ZIP_CREATED_SUCCESS: $sizeMB MB at $zipPath"
