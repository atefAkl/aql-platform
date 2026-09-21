<?php

namespace Tests\Feature;

use App\Models\RegistrationRequest;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Stancl\Tenancy\Events\TenantCreated;
use Stancl\Tenancy\Jobs\DeleteDatabase;
use Tests\TestCase;

class TenantLifecycleContractTest extends TestCase
{
    public function test_tenant_db_is_not_created_at_approval()
    {
        $tenantId = 'approval-corp-'.rand(1000, 9999);
        // 1. Create a PENDING request
        $request = RegistrationRequest::create([
            'organization_name' => 'Approval Corp',
            'slug' => $tenantId,
            'admin_name' => 'Admin',
            'admin_email' => "admin@{$tenantId}.com",
            'status' => 'pending',
        ]);

        // 2. Approve Request (simulating what the controller does)
        $request->update([
            'status' => 'approved',
            'activation_token' => Str::random(60),
            'token_expires_at' => now()->addDays(7),
        ]);

        Tenant::withoutEvents(function () use ($tenantId, $request) {
            Tenant::create([
                'id' => $tenantId,
                'name' => $request->organization_name,
                'status' => null, // Pre-operational
            ]);
        });

        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'status' => null,
        ], 'pgsql');

        // 3. Verify no DB was created
        $dbName = config('tenancy.database.prefix').$tenantId;
        $dbExists = DB::connection('pgsql')->select('SELECT datname FROM pg_catalog.pg_database WHERE datname = ?', [$dbName]);

        $this->assertEmpty($dbExists, 'Tenant DB should NOT be created at approval.');

        // Teardown
        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::find($tenantId)?->delete();
        });
        $request->delete();
    }

    public function test_provisioning_failure_allows_retry_and_preserves_state()
    {
        $tenantId = 'fail-corp-'.rand(1000, 9999);

        $request = RegistrationRequest::create([
            'organization_name' => 'Fail Corp',
            'slug' => $tenantId,
            'admin_name' => 'Admin',
            'admin_email' => "admin@{$tenantId}.com",
            'status' => 'approved',
            'activation_token' => Str::random(60),
        ]);

        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::create([
                'id' => $tenantId,
                'name' => 'Fail Corp',
                'status' => null,
            ]);
        });

        $tenant = Tenant::find($tenantId);
        try {
            event(new TenantCreated($tenant)); // Creates DB
            throw new \Exception('Provisioning Failed!');
        } catch (\Exception $e) {
            // Compensation
            dispatch_sync(new DeleteDatabase($tenant));
        }

        // Verify state is preserved
        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'status' => null,
        ], 'pgsql');

        $this->assertDatabaseHas('registration_requests', [
            'slug' => $tenantId,
            'status' => 'approved',
        ], 'pgsql');

        $dbName = config('tenancy.database.prefix').$tenantId;
        $dbExists = DB::connection('pgsql')->select('SELECT datname FROM pg_catalog.pg_database WHERE datname = ?', [$dbName]);
        $this->assertEmpty($dbExists, 'Tenant DB should be dropped on failure.');

        // Teardown
        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::find($tenantId)?->delete();
        });
        $request->delete();
    }

    public function test_archived_state_behavior()
    {
        $tenantId = 'archive-corp-'.rand(1000, 9999);

        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::create([
                'id' => $tenantId,
                'name' => 'Archive Corp',
                'status' => 'archived',
            ]);
        });

        $this->assertDatabaseHas('tenants', [
            'id' => $tenantId,
            'status' => 'archived',
        ], 'pgsql');

        // Teardown
        Tenant::withoutEvents(function () use ($tenantId) {
            Tenant::find($tenantId)?->delete();
        });
    }
}
