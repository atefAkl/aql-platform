<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Tests\TestCase;

class AuthTest extends TestCase
{
    public function test_user_can_login_with_valid_credentials()
    {
        $service = new TenantProvisioningService();
        $tenantId = 'authcorp' . rand(100, 999);
        $tenant = $service->createTenant(
            $tenantId,
            'شركة الهوية الموثوقة',
            'سامي محمود',
            "admin@{$tenantId}.com",
            'password123'
        );

        $response = $this->post('/login', [
            'email' => "admin@{$tenantId}.com",
            'password' => 'password123',
        ]);

        $response->assertRedirect('/users');
        $this->assertAuthenticated();

        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }
}
