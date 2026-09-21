<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Tests\TestCase;
use Stancl\Tenancy\Jobs\DeleteDatabase;

class TenantProvisioningTest extends TestCase
{
    public function test_tenant_creation_database_provisioning_and_seeding()
    {
        $service = new TenantProvisioningService;

        $tenantId = 'provcorp'.rand(1000, 9999);
        
        // 1. Manually create the Tenant record without triggering tenancy DB creation
        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::create([
                'id' => $tenantId,
                'name' => 'شركة النشر والتهيئة الكاملة',
                'status' => null, // Pre-operational condition
            ]);
        });

        // 2. Provision Tenant
        $res = $service->provisionTenant(
            $tenantId,
            'خالد عبد الرحمن',
            "admin@{$tenantId}.com",
            'password123'
        );
        $tenant = $res['tenant'];

        // 3. Verify Landlord Central DB records
        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'name' => 'شركة النشر والتهيئة الكاملة',
            'status' => null,
        ], 'pgsql');

        $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        $centralDomain = preg_replace('/^www\./', '', $centralDomain);
        
        $this->assertDatabaseHas('domains', [
            'tenant_id' => $tenantId,
            'domain' => "{$tenantId}.{$centralDomain}",
        ], 'pgsql');

        // 4. Verify Tenant DB context, migrations, admin user, permissions, and roles
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
        dispatch_sync(new DeleteDatabase($tenant));
        $tenant->delete();
    }
}

