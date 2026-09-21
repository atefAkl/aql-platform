<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    protected Tenant $tenant;

    protected string $tenantId;

    protected function setUp(): void
    {
        parent::setUp();

        $service = new TenantProvisioningService;
        $this->tenantId = 'auditsuite'.rand(1000, 9999);
        \App\Models\Tenant::unsetEventDispatcher();
        \App\Models\Tenant::firstOrCreate([
            'id' => $this->tenantId,
        ], [
            'name' => 'شركة السجل والتدقيق',
            'status' => null,
        ]);
        \App\Models\Tenant::setEventDispatcher(app('events'));
        $res = $service->provisionTenant($this->tenantId, 'مدير تدقيق الأمان', "admin@{$this->tenantId}.com", 'password123');
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

    public function test_audit_log_records_tenant_provisioning_and_user_creation()
    {
        $domain = $this->tenant->domains()->first()->domain;
        // 1. Verify TENANT_PROVISIONED event
        $this->tenant->run(function () {
            $log = AuditLog::where('action', 'TENANT_PROVISIONED')->first();
            $this->assertNotNull($log);
            $this->assertEquals('Tenant', $log->entity_type);
        });

        // 2. Login as Admin and Create a User
        $this->post("http://{$domain}/login", [
            'email' => "admin@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $role = null;
        $this->tenant->run(function () use (&$role) {
            $role = Role::where('code', 'staff')->first();
        });

        $this->post("http://{$domain}/users", [
            'name' => 'جديد موظف',
            'email' => "newuser@{$this->tenantId}.com",
            'password' => 'password123',
            'role_id' => $role->id,
        ]);

        // Verify USER_CREATED event recorded
        $this->tenant->run(function () {
            $userLog = AuditLog::where('action', 'USER_CREATED')->first();
            $this->assertNotNull($userLog);
            $this->assertEquals('User', $userLog->entity_type);
            $this->assertStringContainsString('جديد موظف', $userLog->description);
        });
    }

    public function test_audit_log_records_permissions_updated_event()
    {
        $domain = $this->tenant->domains()->first()->domain;
        $this->post("http://{$domain}/login", [
            'email' => "admin@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $adminUser = null;
        $permId = null;
        $this->tenant->run(function () use (&$adminUser, &$permId) {
            $adminUser = User::where('email', "admin@{$this->tenantId}.com")->first();
            $permId = Permission::first()->id;
        });

        // Update permissions for admin
        $this->post("http://{$domain}/users/{$adminUser->id}/permissions", [
            'permission_ids' => [$permId],
        ]);

        // Verify PERMISSIONS_UPDATED event recorded
        $this->tenant->run(function () {
            $permLog = AuditLog::where('action', 'PERMISSIONS_UPDATED')->first();
            $this->assertNotNull($permLog);
            $this->assertEquals('User', $permLog->entity_type);
        });
    }
}
