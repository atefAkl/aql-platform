<?php

use App\Services\TenantProvisioningService;
use Illuminate\Contracts\Console\Kernel;

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Kernel::class);
$kernel->bootstrap();

try {
    $service = new TenantProvisioningService;
    $res = $service->createTenant('test-ops-debug2', 'Test', 'Admin', 'admin2@testops.local', 'password123', 'test-ops-debug2.localhost');
    echo 'SUCCESS: '.$res['tenant']->id."\n";
} catch (Exception $e) {
    echo 'ERROR: '.$e->getMessage()."\n";
}
