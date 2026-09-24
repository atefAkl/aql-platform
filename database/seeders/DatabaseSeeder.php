<?php

namespace Database\Seeders;

use App\Models\PlatformUser;
use App\Models\Tenant;
use App\Services\TenantProvisioningService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
            Tenant::withoutEvents(function () use ($tenantId) {
                Tenant::create([
                    'id' => $tenantId,
                    'name' => 'شركة الأفق العالمية',
                    'status' => 'active',
                ]);
            });

            $service = new TenantProvisioningService;
            $centralDomain = env('TENANT_BASE_DOMAIN') ?? preg_replace('/^(www\.|platform\.)/', '', parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost');

            $service->provisionTenant(
                $tenantId,
                'الأدمن الرئيسي',
                'admin@acme.com',
                'password123',
                $tenantId.'.'.$centralDomain
            );
        }

        // Seed Platform Admin
        if (PlatformUser::count() === 0) {
            PlatformUser::create([
                'name' => 'مدير المنصة',
                'email' => 'admin@platform.local',
                'password' => Hash::make('password123'),
            ]);
        }
    }
}
