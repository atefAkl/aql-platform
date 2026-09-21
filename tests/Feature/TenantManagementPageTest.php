<?php

namespace Tests\Feature;

use App\Models\PlatformUser;
use App\Models\Tenant;
use Tests\TestCase;

class TenantManagementPageTest extends TestCase
{
    public function test_platform_admin_can_view_tenant_accounts_management_page()
    {
        $admin = PlatformUser::factory()->create();

        $response = $this->actingAs($admin, 'platform')->get('/admin/tenants');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Platform/Tenants/Index'));
    }

    public function test_tenant_status_transitions_suspend_restore_archive()
    {
        $admin = PlatformUser::factory()->create();
        $tenantId = 'mgmtcorp'.rand(1000, 9999);

        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::create([
                'id' => $tenantId,
                'name' => 'Management Corp',
                'status' => 'active',
            ]);
        });

        // 1. Suspend Active Tenant
        $response = $this->actingAs($admin, 'platform')
            ->post("/admin/tenants/{$tenantId}/suspend");
        $response->assertRedirect();
        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'status' => 'suspended',
        ], 'pgsql');

        // 2. Archive Suspended Tenant
        $response = $this->actingAs($admin, 'platform')
            ->post("/admin/tenants/{$tenantId}/archive");
        $response->assertRedirect();
        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'status' => 'archived',
        ], 'pgsql');

        // 3. Restore Archived Tenant to Active
        $response = $this->actingAs($admin, 'platform')
            ->post("/admin/tenants/{$tenantId}/restore");
        $response->assertRedirect();
        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'status' => 'active',
        ], 'pgsql');

        // Teardown
        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::find($tenantId)?->delete();
        });
    }
}
