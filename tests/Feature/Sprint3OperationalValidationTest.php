<?php

namespace Tests\Feature;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use App\Services\TenantProvisioningService;

class Sprint3OperationalValidationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        
        // Ensure test DB is clean or we have a specific test tenant
        $this->tenantId = 'test-ops-' . strtolower(\Illuminate\Support\Str::random(4));
        
        $service = new TenantProvisioningService();
        \App\Models\Tenant::unsetEventDispatcher();
        \App\Models\Tenant::firstOrCreate([
            'id' => $this->tenantId,
        ], [
            'name' => 'Test Ops Corp',
            'status' => null,
        ]);
        \App\Models\Tenant::setEventDispatcher(app('events'));
        $service->provisionTenant($this->tenantId, 'Admin', 'admin@testops.local', 'password123',
            $this->tenantId . '.localhost');
    }

    protected function tearDown(): void
    {
        Tenant::find($this->tenantId)?->delete();
        parent::tearDown();
    }

    public function test_active_tenant_and_user_can_access_protected_routes()
    {
        $domain = $this->tenantId . '.localhost';
        
        tenancy()->initialize(Tenant::find($this->tenantId));
        $user = User::where('email', 'admin@testops.local')->first();
        
        $response = $this->actingAs($user)->get('http://' . $domain . '/users');
        $response->assertStatus(200);
        
        tenancy()->end();
    }

    public function test_suspended_tenant_is_blocked()
    {
        $tenant = Tenant::find($this->tenantId);
        $tenant->update(['status' => 'suspended']);
        
        $domain = $this->tenantId . '.localhost';
        
        tenancy()->initialize($tenant);
        $user = User::where('email', 'admin@testops.local')->first();
        
        // GET should be allowed (Read-Only Mode)
        $response = $this->actingAs($user)->get('http://' . $domain . '/users');
        $response->assertStatus(200);

        // POST should be blocked (No writes)
        $response = $this->actingAs($user)->post('http://' . $domain . '/users', [
            'name' => 'Test User',
            'email' => 'test@test.local',
        ]);
        $response->assertStatus(403);
        
        tenancy()->end();
    }

    public function test_inactive_user_is_blocked_and_logged_out()
    {
        $domain = $this->tenantId . '.localhost';
        
        tenancy()->initialize(Tenant::find($this->tenantId));
        $user = User::where('email', 'admin@testops.local')->first();
        $user->update(['status' => 'suspended']);
        
        $response = $this->actingAs($user)->get('http://' . $domain . '/users');
        
        $response->assertRedirect(route('login'));
        $this->assertGuest();
        
        tenancy()->end();
    }
}
