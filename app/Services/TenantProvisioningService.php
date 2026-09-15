<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TenantProvisioningService
{
    /**
     * Provision a new tenant database, run migrations, and seed initial tenant admin, roles, and permissions.
     */
    public function createTenant(string $id, string $name, string $adminName, string $adminEmail, string $adminPassword, ?string $domain = null): Tenant
    {
        // 1. Create Tenant in Landlord Central DB
        $tenant = Tenant::create([
            'id' => Str::slug($id),
            'name' => $name,
            'status' => 'active',
        ]);

        // 2. Create Domain mapping
        $domainName = $domain ?? Str::slug($id) . '.localhost';
        $tenant->domains()->create([
            'domain' => $domainName,
        ]);

        // 3. Initialize Tenancy Context & Seed Initial Database Data inside Tenant DB
        $tenant->run(function () use ($adminName, $adminEmail, $adminPassword) {
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

            // Record Selective Audit Log
            AuditLogService::record(
                'TENANT_PROVISIONED',
                'Tenant',
                $adminUser->id . '',
                "تم تجهيز ونشر قاعدة بيانات المستأجر بنجاح وتوليد قوالب الأدوار وحساب الأدمن الرئيسي: {$adminEmail}",
                ['tenant_id' => $adminUser->id]
            );
        });

        return $tenant;
    }
}
