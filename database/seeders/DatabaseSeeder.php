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
            $service = new TenantProvisioningService;
            $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
            $service->createTenant(
                $tenantId,
                'شركة الأفق العالمية',
                'الأدمن الرئيسي',
                'admin@acme.com',
                'password123',
                $tenantId.'.'.$centralDomain
            );
        }
    }
}
