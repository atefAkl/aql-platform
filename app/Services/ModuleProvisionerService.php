<?php

namespace App\Services;

use App\Models\Tenant;
use App\Models\Module;
use App\Models\TenantSubscription;
use Illuminate\Support\Facades\Log;

class ModuleProvisionerService
{
    /**
     * Provision a module for a tenant.
     */
    public function provision(Tenant $tenant, string $moduleCode): TenantSubscription
    {
        $module = Module::where('code', $moduleCode)->firstOrFail();
        
        $subscription = TenantSubscription::updateOrCreate(
            ['tenant_id' => $tenant->id, 'module_code' => $moduleCode],
            ['status' => 'provisioning']
        );

        try {
            // Simulated Provisioning Logic: running module-specific migrations, seeding data.
            $tenant->run(function () use ($module) {
                // E.g., Artisan::call('module:migrate', ['module' => $module->code]);
                // We're skipping actual artisan calls for this simulated Workstream.
            });

            // Mark as active
            $subscription->update(['status' => 'active']);
            
            return $subscription;
        } catch (\Throwable $e) {
            Log::error("Module Provisioning failed for Tenant {$tenant->id}, Module {$moduleCode}: " . $e->getMessage());

            $this->rollback($subscription);

            throw new \RuntimeException("فشل في تهيئة التطبيق: " . $e->getMessage());
        }
    }

    /**
     * Rollback a failed provisioning attempt.
     */
    public function rollback(TenantSubscription $subscription): void
    {
        $subscription->update(['status' => 'failed']);
        
        // Remove partial state inside tenant DB
        $subscription->tenant->run(function () use ($subscription) {
            // E.g., Artisan::call('module:migrate:rollback', ['module' => $subscription->module_code]);
        });
    }

    /**
     * Deprovision a module intentionally (distinct from rollback).
     * Does NOT delete business data automatically.
     */
    public function deprovision(TenantSubscription $subscription): void
    {
        // Mark as suspended or inactive, preventing access without deleting data.
        $subscription->update(['status' => 'suspended']);
        
        // Optional: clear cached permissions, routes, etc.
    }
}
