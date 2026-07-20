<?php
/**
 * Helper script to cleanly delete the git repository folder on cPanel.
 * Upload to: /home/websybd/henleyzone.com/public_html/clean-repo.php
 * Run via browser: https://henleyzone.com/clean-repo.php
 * DELETE THIS FILE IMMEDIATELY AFTER RUNNING!
 */

$dir = '/home/websybd/repositories/Henley_Zone';

if (!is_dir($dir)) {
    echo "SUCCESS: Directory does not exist! You can proceed with Git clone in cPanel right now.";
    exit;
}

function rrmdir($src) {
    $dir = opendir($src);
    while(false !== ( $file = readdir($dir)) ) {
        if (( $file != '.' ) && ( $file != '..' )) {
            $full = $src . '/' . $file;
            if ( is_dir($full) ) {
                rrmdir($full);
            }
            else {
                unlink($full);
            }
        }
    }
    closedir($dir);
    rmdir($src);
}

try {
    rrmdir($dir);
    echo "SUCCESS: The folder '$dir' was completely deleted! You can go back to cPanel Git Version Control and create the repository now.";
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}
?>
