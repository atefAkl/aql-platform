<?php

$files = glob(__DIR__.'/tests/Feature/*.php');
foreach ($files as $file) {
    $content = file_get_contents($file);

    $content = preg_replace_callback(
        '/\$([a-zA-Z0-9_]+)->createTenant\(\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*([^,]+?)\s*,\s*([^)]+?)\s*\)/s',
        function ($matches) {
            $var = $matches[1];
            $id = $matches[2];
            $name = $matches[3];
            $admin = $matches[4];
            $email = $matches[5];
            $pass = $matches[6];

            return "\\App\\Models\\Tenant::unsetEventDispatcher();
        \\App\\Models\\Tenant::firstOrCreate([
            'id' => $id,
        ], [
            'name' => $name,
            'status' => null,
        ]);
        \\App\\Models\\Tenant::setEventDispatcher(app('events'));
        \$".$var."->provisionTenant($id, $admin, $email, $pass)";
        },
        $content
    );

    file_put_contents($file, $content);
}

echo "Done.\n";
