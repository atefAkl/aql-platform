<?php

namespace Tests\Feature;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Tests\TestCase;

class AuthorizationTest extends TestCase
{
    protected Tenant $tenant;

    protected string $tenantId;

    protected function setUp(): void
    {
        parent::setUp();

        $service = new TenantProvisioningService;
        $this->tenantId = 'authzsuite'.rand(1000, 9999);
        \App\Models\Tenant::unsetEventDispatcher();
        \App\Models\Tenant::firstOrCreate([
            'id' => $this->tenantId,
        ], [
            'name' => 'شركة التحكم بالصلاحيات',
            'status' => null,
        ]);
        \App\Models\Tenant::setEventDispatcher(app('events'));
        $res = $service->provisionTenant($this->tenantId, 'مدير الصلاحيات', "admin@{$this->tenantId}.com", 'password123');
        $this->tenant = $res['tenant'];
    }

    protected function tearDown(): void
    {
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $this->tenant->delete();
        parent::tearDown();
    }

    public function test_authorized_user_can_access_permitted_routes()
    {
        $domain = $this->tenant->domains()->first()->domain;
        $this->post("http://{$domain}/login", [
            'email' => "admin@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $response = $this->get("http://{$domain}/users");
        $response->assertStatus(200);

        $auditResponse = $this->get("http://{$domain}/audit");
        $auditResponse->assertStatus(200);
    }

    public function test_unauthorized_user_is_denied_access()
    {
        $domain = $this->tenant->domains()->first()->domain;
        // Create a user with NO permissions
        $restrictedUser = null;
        $this->tenant->run(function () use (&$restrictedUser) {
            $restrictedUser = User::create([
                'name' => 'Restricted Staff',
                'email' => "restricted@{$this->tenantId}.com",
                'password' => bcrypt('password123'),
                'role_title' => 'موظف محدد',
                'status' => 'active',
            ]);
        });

        // Login as restricted user
        $this->post("http://{$domain}/login", [
            'email' => "restricted@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $response = $this->get("http://{$domain}/users");
        $response->assertStatus(403);

        $auditResponse = $this->get("http://{$domain}/audit");
        $auditResponse->assertStatus(403);
    }

    public function test_direct_permission_and_role_template_permission_granting()
    {
        $this->tenant->run(function () {
            $staffRole = Role::where('code', 'staff')->first();
            $user = User::create([
                'name' => 'Accountant Employee',
                'email' => "accountant@{$this->tenantId}.com",
                'password' => bcrypt('password123'),
                'role_id' => $staffRole->id,
                'role_title' => $staffRole->name,
                'status' => 'active',
            ]);

            // 1. Role permission check (staff has expenses.view)
            $this->assertTrue($user->hasPermission('expenses.view'));
            $this->assertFalse($user->hasPermission('users.permissions'));

            // 2. Direct permission grant (assign users.permissions directly to user)
            $perm = Permission::where('code', 'users.permissions')->first();
            $user->permissions()->attach($perm->id);

            $this->assertTrue($user->fresh()->hasPermission('users.permissions'));

            // 3. Revoke direct permission
            $user->permissions()->detach($perm->id);
            $this->assertFalse($user->fresh()->hasPermission('users.permissions'));
        });
    }
}
