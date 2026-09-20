<?php

use Illuminate\Contracts\Console\Kernel;

putenv('DB_DATABASE=landlord_test_db');
$_ENV['DB_DATABASE'] = 'landlord_test_db';
$_SERVER['DB_DATABASE'] = 'landlord_test_db';

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

Illuminate\Support\Facades\Artisan::call('migrate:fresh', [
    '--force' => true,
]);

echo Artisan::output();
