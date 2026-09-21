<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Permission;
use App\Models\Role;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Stancl\Tenancy\Events\TenantCreated;
use Stancl\Tenancy\Jobs\DeleteDatabase;

class TenantProvisioningService
{
    /**
     * Provision a tenant database, run migrations, and seed initial tenant admin, roles, and permissions.
     * Implements explicit compensation & cleanup strategy on any provisioning failure without deleting the Tenant Record.
     *
     * @return array{tenant: Tenant, admin_user: User}
     */
    public function provisionTenant(string $id, string $adminName, string $adminEmail, string $adminPassword, ?string $domain = null): array
    {
        $tenantId = Str::slug($id);
        $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        $centralDomain = preg_replace('/^www\./', '', $centralDomain);
        $domainName = $domain ?? ($tenantId.'.'.$centralDomain);

        $tenant = Tenant::findOrFail($tenantId);
        $adminUser = null;

        try {
            // 1. Create Domain mapping
            $tenant->domains()->firstOrCreate([
                'domain' => $domainName,
            ]);

            // 2. Dispatch event to create and migrate database
            // This natively triggers the JobPipeline (CreateDatabase, MigrateDatabase)
            event(new TenantCreated($tenant));

            // 3. Initialize Tenancy Context & Seed Initial Database Data inside Tenant DB
            $tenant->run(function () use ($tenant, $adminName, $adminEmail, $adminPassword, &$adminUser) {
                // Seed Atomic Permissions Catalog
                $permissionsData = [
                    ['code' => 'expenses.view', 'name' => 'عرض المصروفات', 'module' => 'expenses'],
                    ['code' => 'expenses.create', 'name' => 'إضافة مصروف جديد', 'module' => 'expenses'],
                    ['code' => 'expenses.edit', 'name' => 'تعديل المصروفات', 'module' => 'expenses'],
                    ['code' => 'expenses.delete', 'name' => 'حذف المصروفات', 'module' => 'expenses'],
                    ['code' => 'expenses.approve', 'name' => 'اعتماد الصرف المالي', 'module' => 'expenses'],
                    ['code' => 'users.view', 'name' => 'عرض قائمة الموظفين', 'module' => 'users'],
                    ['code' => 'users.create', 'name' => 'إضافة موظف جديد', 'module' => 'users'],
                    ['code' => 'users.edit', 'name' => 'تعديل بيانات الموظف', 'module' => 'users'],
                    ['code' => 'users.permissions', 'name' => 'إدارة الصلاحيات المباشرة', 'module' => 'users'],
                    ['code' => 'audit.view', 'name' => 'عرض سجل العمليات الحساسة', 'module' => 'audit'],
                ];

                $createdPermissions = [];
                foreach ($permissionsData as $pData) {
                    $permission = Permission::firstOrCreate(['code' => $pData['code']], $pData);
                    $createdPermissions[$permission->code] = $permission->id;
                }

                // Seed Standard Role Templates (ADR-005)
                $adminRole = Role::firstOrCreate(['code' => 'admin'], [
                    'name' => 'مدير النظام',
                    'description' => 'صلاحيات كاملة للتحكم في كافة موديولات المنصة والمستأجر',
                ]);
                $adminRole->permissions()->sync(array_values($createdPermissions));

                $accountantRole = Role::firstOrCreate(['code' => 'accountant'], [
                    'name' => 'محاسب عام',
                    'description' => 'إدارة واعتماد المصروفات والاستعلام عن التقارير',
                ]);
                $accountantRole->permissions()->sync([
                    $createdPermissions['expenses.view'],
                    $createdPermissions['expenses.create'],
                    $createdPermissions['expenses.edit'],
                    $createdPermissions['expenses.approve'],
                ]);

                $staffRole = Role::firstOrCreate(['code' => 'staff'], [
                    'name' => 'موظف مبيعات / إدخال',
                    'description' => 'صلاحيات الاستعلام وإدخال المصروفات الأولية',
                ]);
                $staffRole->permissions()->sync([
                    $createdPermissions['expenses.view'],
                    $createdPermissions['expenses.create'],
                ]);

                // Create Initial Tenant Admin User
                $adminUser = User::create([
                    'name' => $adminName,
                    'email' => $adminEmail,
                    'password' => Hash::make($adminPassword),
                    'role_id' => $adminRole->id,
                    'role_title' => $adminRole->name,
                    'status' => 'active',
                ]);

                // Assign All Direct Permissions to Admin
                $adminUser->permissions()->sync(array_values($createdPermissions));

                // Record Selective Audit Log for TENANT_PROVISIONED
                AuditLogService::record(
                    'TENANT_PROVISIONED',
                    'Tenant',
                    $adminUser->id.'',
                    "تم تجهيز ونشر قاعدة بيانات المستأجر بنجاح وتوليد قوالب الأدوار وحساب الأدمن الرئيسي: {$adminEmail}",
                    ['tenant_id' => $tenant->id]
                );
            });

            return [
                'tenant' => $tenant,
                'admin_user' => $adminUser,
            ];
        } catch (\Throwable $e) {
            Log::error("Tenant provisioning failed for [{$tenantId}]: ".$e->getMessage(), [
                'exception' => $e,
            ]);

            // Compensation / Cleanup strategy: remove partial resources
            if ($tenant) {
                try {
                    if (function_exists('tenant') && tenant() && tenant('id') === $tenant->id) {
                        tenancy()->end();
                    }
                    $tenant->domains()->delete();
                    
                    // Drop PostgreSQL tenant database if created, but keep the Tenant Record in Landlord DB
                    dispatch_sync(new DeleteDatabase($tenant));
                } catch (\Throwable $cleanupEx) {
                    Log::error("Compensation cleanup error for [{$tenantId}]: ".$cleanupEx->getMessage());
                }
            }

            throw new \RuntimeException('فشل في تهيئة ونشر بيئة المؤسسة: '.$e->getMessage(), (int) $e->getCode(), $e);
        }
    }
}

