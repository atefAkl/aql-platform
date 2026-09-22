<?php

namespace Tests\Feature;

use App\Models\Module;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Illuminate\Support\Str;
use Tests\TestCase;

class Sprint3ModuleAvailabilityTest extends TestCase
{
    protected string $tenantId;

    protected string $domain;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tenantId = 'test-mod-'.strtolower(Str::random(4));
        $this->domain = $this->tenantId.'.localhost';

        $service = new TenantProvisioningService;
        Tenant::unsetEventDispatcher();
        Tenant::firstOrCreate([
            'id' => $this->tenantId,
        ], [
            'name' => 'Test Mod Corp',
            'status' => null,
        ]);
        Tenant::setEventDispatcher(app('events'));
        $service->provisionTenant($this->tenantId, 'Admin', 'admin@testmod.local', 'password123',
            $this->domain);

        // Register the expenses module in Landlord DB
        Module::firstOrCreate(['code' => 'expenses'], [
            'name' => 'Expenses Management',
            'status' => 'active',
        ]);
    }

    protected function tearDown(): void
    {
        Tenant::find($this->tenantId)?->delete();
        parent::tearDown();
    }

    public function test_tenant_cannot_access_unsubscribed_module()
    {
        tenancy()->initialize(Tenant::find($this->tenantId));
        $user = User::where('email', 'admin@testmod.local')->first();

        $response = $this->actingAs($user)->get('http://'.$this->domain.'/expenses');
        $response->assertStatus(403);
        $response->assertSee('هذه المؤسسة غير مشتركة في تطبيق');

        tenancy()->end();
    }

    public function test_tenant_can_access_subscribed_module()
    {
        // Add Subscription
        TenantSubscription::create([
            'tenant_id' => $this->tenantId,
            'module_code' => 'expenses',
            'status' => 'active',
        ]);

        tenancy()->initialize(Tenant::find($this->tenantId));
        $user = User::where('email', 'admin@testmod.local')->first();

        $response = $this->actingAs($user)->get('http://'.$this->domain.'/expenses');
        $response->assertStatus(200);
        $response->assertSee('Expenses Module Access Granted');

        tenancy()->end();
    }

    public function test_tenant_cannot_access_suspended_module_subscription()
    {
        // Add Suspended Subscription
        TenantSubscription::create([
            'tenant_id' => $this->tenantId,
            'module_code' => 'expenses',
            'status' => 'suspended',
        ]);

        tenancy()->initialize(Tenant::find($this->tenantId));
        $user = User::where('email', 'admin@testmod.local')->first();

        $response = $this->actingAs($user)->get('http://'.$this->domain.'/expenses');
        $response->assertStatus(403);
        $response->assertSee('هذه المؤسسة غير مشتركة في تطبيق');

        tenancy()->end();
    }
}
