<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Permission;
use App\Services\TenantProvisioningService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantProvisioningTest extends TestCase
{
    public function test_tenant_creation_and_database_provisioning()
    {
        $service = new TenantProvisioningService();

        $tenantId = 'testcorp' . rand(100, 999);
        $tenant = $service->createTenant(
            $tenantId,
            'شركة الاختبار المتحدة',
            'أحمد علي',
            "admin@{$tenantId}.com",
            'password123'
        );

        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'name' => 'شركة الاختبار المتحدة',
        ], 'pgsql');

        // Test running code inside tenant DB context
        $tenant->run(function () use ($tenantId) {
            $user = User::where('email', "admin@{$tenantId}.com")->first();
            $this->assertNotNull($user);
            $this->assertEquals('أحمد علي', $user->name);

            // Verify direct permissions assigned
            $this->assertTrue($user->hasDirectPermission('expenses.create'));
            $this->assertTrue($user->hasDirectPermission('users.permissions'));
            $this->assertEquals(10, Permission::count());
        });

        // Cleanup test tenant DB
        $tenant->delete();
    }
}
