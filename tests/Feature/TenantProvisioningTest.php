<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Permission;
use App\Models\Role;
use App\Services\TenantProvisioningService;
use Tests\TestCase;

class TenantProvisioningTest extends TestCase
{
    public function test_tenant_creation_database_provisioning_and_seeding()
    {
        $service = new TenantProvisioningService();

        $tenantId = 'provcorp' . rand(1000, 9999);
        $tenant = $service->createTenant(
            $tenantId,
            'شركة النشر والتهيئة الكاملة',
            'خالد عبد الرحمن',
            "admin@{$tenantId}.com",
            'password123'
        );

        // 1. Verify Landlord Central DB records
        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'name' => 'شركة النشر والتهيئة الكاملة',
        ], 'pgsql');

        $this->assertDatabaseHas('domains', [
            'tenant_id' => $tenantId,
            'domain' => "{$tenantId}.localhost",
        ], 'pgsql');

        // 2. Verify Tenant DB context, migrations, admin user, permissions, and roles
        $tenant->run(function () use ($tenantId) {
            // Admin user verification
            $user = User::where('email', "admin@{$tenantId}.com")->first();
            $this->assertNotNull($user);
            $this->assertEquals('خالد عبد الرحمن', $user->name);

            // Permissions catalog verification (10 atomic permissions)
            $this->assertEquals(10, Permission::count());
            $this->assertTrue($user->hasPermission('users.view'));
            $this->assertTrue($user->hasPermission('users.create'));
            $this->assertTrue($user->hasPermission('users.permissions'));
            $this->assertTrue($user->hasPermission('expenses.view'));
            $this->assertTrue($user->hasPermission('audit.view'));

            // Role Templates verification (admin, accountant, staff)
            $this->assertEquals(3, Role::count());
            $this->assertNotNull(Role::where('code', 'admin')->first());
            $this->assertNotNull(Role::where('code', 'accountant')->first());
            $this->assertNotNull(Role::where('code', 'staff')->first());
        });

        // Teardown
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }
}
