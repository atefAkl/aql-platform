<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    public function test_tenant_database_and_data_isolation()
    {
        $service = new TenantProvisioningService();

        // 1. Create Tenant A
        $idA = 'tenant-a-' . rand(100, 999);
        $tenantA = $service->createTenant(
            $idA,
            'Tenant A Corporation',
            'Admin Tenant A',
            "admin@{$idA}.com",
            'password123'
        );

        // 2. Create Tenant B
        $idB = 'tenant-b-' . rand(100, 999);
        $tenantB = $service->createTenant(
            $idB,
            'Tenant B Corporation',
            'Admin Tenant B',
            "admin@{$idB}.com",
            'password123'
        );

        // 3. Add extra user in Tenant A
        $tenantA->run(function () use ($idA) {
            User::create([
                'name' => 'Exclusive User A',
                'email' => "user.a@{$idA}.com",
                'password' => bcrypt('password123'),
                'role_title' => 'موظف مبيعات',
                'status' => 'active',
            ]);
        });

        // 4. Verify Tenant A database contains User A and cannot see Tenant B data
        $tenantA->run(function () use ($idA, $idB) {
            $userA = User::where('email', "user.a@{$idA}.com")->first();
            $this->assertNotNull($userA, 'Tenant A DB must contain user A');

            $userB = User::where('email', "admin@{$idB}.com")->first();
            $this->assertNull($userB, 'Tenant A DB MUST NOT see Tenant B admin user');
        });

        // 5. Verify Tenant B database contains User B and cannot see Tenant A data
        $tenantB->run(function () use ($idA, $idB) {
            $userB = User::where('email', "admin@{$idB}.com")->first();
            $this->assertNotNull($userB, 'Tenant B DB must contain user B');

            $userA = User::where('email', "user.a@{$idA}.com")->first();
            $this->assertNull($userA, 'Tenant B DB MUST NOT see Tenant A user');
        });

        // Teardown
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenantA->delete();
        $tenantB->delete();
    }
}
