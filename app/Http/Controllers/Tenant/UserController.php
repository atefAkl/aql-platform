<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of team users, role templates, and direct permission assignments.
     */
    public function index(): Response
    {
        $users = User::with(['role', 'permissions'])->orderBy('id', 'desc')->get();
        $roles = Role::with('permissions')->get();
        $permissions = Permission::all()->groupBy('module');

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created team user with primary role template (ADR-005).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role_id' => ['nullable', 'exists:roles,id'],
        ]);

        $role = $validated['role_id'] ? Role::find($validated['role_id']) : null;

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role?->id,
            'role_title' => $role?->name ?? 'عضو فريق',
            'status' => 'active',
        ]);

        // Automatically assign role permissions as initial direct permissions template
        if ($role) {
            $user->permissions()->sync($role->permissions->pluck('id'));
        }

        AuditLogService::record(
            'USER_CREATED',
            'User',
            $user->id . '',
            "تم إضافة موظف جديد: {$user->name} ({$user->email}) وتعيين الدور الوظيفي: " . ($role?->name ?? 'عضو فريق')
        );

        return back()->with('success', 'تم إضافة الموظف وتعيين دوره الوظيفي بنجاح.');
    }

    /**
     * Update primary role template and direct permissions for a specific user (ADR-003 & ADR-005).
     */
    public function updatePermissions(Request $request, User $user)
    {
        $validated = $request->validate([
            'role_id' => ['nullable', 'exists:roles,id'],
            'permission_ids' => ['array'],
            'permission_ids.*' => ['exists:permissions,id'],
        ]);

        $role = isset($validated['role_id']) ? Role::find($validated['role_id']) : $user->role;
        $newIds = $validated['permission_ids'] ?? [];
        $oldIds = $user->permissions()->pluck('permissions.id')->toArray();

        $user->update([
            'role_id' => $role?->id,
            'role_title' => $role?->name ?? $user->role_title,
        ]);

        $user->permissions()->sync($newIds);

        // Selective Audit Log for Security-Sensitive Permission Grant/Revoke Event
        AuditLogService::record(
            'PERMISSIONS_UPDATED',
            'User',
            $user->id . '',
            "تحديث الدور والصلاحيات المباشرة للموظف: {$user->name}",
            [
                'role' => $role?->name,
                'previous_permissions_count' => count($oldIds),
                'new_permissions_count' => count($newIds),
            ]
        );

        return back()->with('success', 'تم حفظ التحديثات والدور والصلاحيات المباشرة بنجاح.');
    }
}
