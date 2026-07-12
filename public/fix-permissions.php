<?php
/**
 * One-time permission fix script for cPanel deployment.
 * Upload to /home/websybd/henleyzone.com/public_html/fix-permissions.php
 * Run once via browser, then DELETE immediately.
 */

$basePath = '/home/websybd/henleyzone.com';

$dirs = [
    $basePath . '/public',
    $basePath . '/.next',
];

$fixed = 0;
$errors = [];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        $errors[] = "Directory not found: $dir";
        continue;
    }
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );
    // Fix the top-level directory itself
    chmod($dir, 0755);
    $fixed++;

    foreach ($iterator as $item) {
        $path = $item->getPathname();
        if ($item->isDir()) {
            chmod($path, 0755);
        } else {
            chmod($path, 0644);
        }
        $fixed++;
    }
}

header('Content-Type: text/plain');
echo "=== Permission Fix Complete ===\n";
echo "Files/Dirs fixed: $fixed\n";
if ($errors) {
    echo "\nErrors:\n";
    foreach ($errors as $e) echo "- $e\n";
}
echo "\n⚠️  DELETE THIS FILE NOW from File Manager!\n";
?>
