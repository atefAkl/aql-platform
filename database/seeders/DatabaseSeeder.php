<?php

namespace Database\Seeders;

use App\Models\Tenant;
use App\Services\TenantProvisioningService;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with initial demo tenant if not present.
     */
    public function run(): void
    {
        $tenantId = 'acme';
        $existing = Tenant::find($tenantId);

        if (! $existing) {
            $service = new TenantProvisioningService();
            $service->createTenant(
                $tenantId,
                'شركة الأفق العالمية',
                'الأدمن الرئيسي',
                'admin@acme.com',
                'password123',
                'acme.localhost'
            );
        }

        // Seed Platform Admin
        if (\App\Models\PlatformUser::count() === 0) {
            \App\Models\PlatformUser::create([
                'name' => 'مدير المنصة',
                'email' => 'admin@platform.local',
                'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            ]);
        }
    }
}
