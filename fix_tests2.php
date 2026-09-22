<?php

$files = glob(__DIR__.'/tests/Feature/*.php');
foreach ($files as $file) {
    $content = file_get_contents($file);

    $content = preg_replace(
        '/\$([a-zA-Z0-9_]+)\s*=\s*\\\\App\\\\Models\\\\Tenant::unsetEventDispatcher\(\);(.*?)\\\\App\\\\Models\\\\Tenant::setEventDispatcher\(app\(\'events\'\)\);\s*\$([a-zA-Z0-9_]+)->provisionTenant\((.*?)\);/s',
        "\\App\\Models\\Tenant::unsetEventDispatcher();\$2\\App\\Models\\Tenant::setEventDispatcher(app('events'));\n        \$$1 = \$$3->provisionTenant($4);",
        $content
    );

    file_put_contents($file, $content);
}

echo "Done.\n";
