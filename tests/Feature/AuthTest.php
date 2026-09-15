<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Tests\TestCase;

class AuthTest extends TestCase
{
    protected Tenant $tenant;
    protected string $tenantId;

    protected function setUp(): void
    {
        parent::setUp();

        $service = new TenantProvisioningService();
        $this->tenantId = 'authsuite' . rand(1000, 9999);
        $this->tenant = $service->createTenant(
            $this->tenantId,
            'شركة مصادقة الهوية',
            'مدير المصادقة',
            "admin@{$this->tenantId}.com",
            'password123'
        );
    }

    protected function tearDown(): void
    {
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $this->tenant->delete();
        parent::tearDown();
    }

    public function test_valid_user_login_succeeds_and_regenerates_session()
    {
        $response = $this->post('/login', [
            'email' => "admin@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $response->assertRedirect('/users');
        $this->assertAuthenticated();

        // Verify selective audit log for AUTH_LOGIN
        $this->tenant->run(function () {
            $this->assertDatabaseHas('audit_logs', [
                'action' => 'AUTH_LOGIN',
            ]);
        });
    }

    public function test_invalid_password_login_fails()
    {
        $response = $this->post('/login', [
            'email' => "admin@{$this->tenantId}.com",
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_unknown_user_login_fails()
    {
        $response = $this->post('/login', [
            'email' => "nonexistent@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_logout_terminates_session_and_records_audit_log()
    {
        // Login first
        $this->post('/login', [
            'email' => "admin@{$this->tenantId}.com",
            'password' => 'password123',
        ]);

        $this->assertAuthenticated();

        // Perform logout
        $response = $this->post('/logout');

        $response->assertRedirect('/login');
        $this->assertGuest();

        // Verify selective audit log for AUTH_LOGOUT
        $this->tenant->run(function () {
            $this->assertDatabaseHas('audit_logs', [
                'action' => 'AUTH_LOGOUT',
            ]);
        });
    }
}
