<?php

namespace Tests\Feature;

use App\Models\PlatformUser;
use App\Models\RegistrationRequest;
use App\Models\Tenant;
use Tests\TestCase;

class TenantDeletionTest extends TestCase
{
    public function test_platform_admin_can_delete_registration_request_and_linked_tenant()
    {
        $admin = PlatformUser::factory()->create();
        $slug = 'delreq'.rand(1000, 9999);

        $request = RegistrationRequest::create([
            'organization_name' => 'Delete Test Corp',
            'slug' => $slug,
            'admin_name' => 'Admin Test',
            'admin_email' => 'admin@deltest.com',
            'status' => 'pending',
        ]);

        Tenant::withoutEvents(function () use ($slug) {
            Tenant::create([
                'id' => $slug,
                'name' => 'Delete Test Corp',
                'status' => null,
            ]);
        });

        $response = $this->actingAs($admin, 'platform')
            ->delete("/admin/requests/{$request->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('registration_requests', ['id' => $request->id], 'pgsql');
        $this->assertDatabaseMissing('tenants', ['id' => $slug], 'pgsql');
    }

    public function test_platform_admin_can_delete_operational_tenant_account()
    {
        $admin = PlatformUser::factory()->create();
        $slug = 'deltenant'.rand(1000, 9999);

        Tenant::withoutEvents(function () use ($slug) {
            Tenant::create([
                'id' => $slug,
                'name' => 'Operational Delete Corp',
                'status' => 'active',
            ]);
        });

        $response = $this->actingAs($admin, 'platform')
            ->delete("/admin/tenants/{$slug}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('tenants', ['id' => $slug], 'pgsql');
    }
}
