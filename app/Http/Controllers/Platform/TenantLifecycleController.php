<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\RegistrationRequest;
use App\Models\Tenant;
use Illuminate\Http\Request;

class TenantLifecycleController extends Controller
{
    /**
     * Display a listing of operational tenant accounts.
     */
    public function index(Request $request)
    {
        $query = Tenant::query()->with('domains');

        if ($request->filled('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        $tenants = $query->latest()->get()->map(function ($tenant) {
            return [
                'id' => $tenant->id,
                'name' => $tenant->name,
                'status' => $tenant->status ?? 'active',
                'created_at' => $tenant->created_at ? $tenant->created_at->toISOString() : now()->toISOString(),
                'domains' => $tenant->domains->pluck('domain')->toArray(),
                'primary_domain' => $tenant->domains->first()?->domain ?? ($tenant->id.'.aql-platform.local'),
            ];
        });

        return inertia('Platform/Tenants/Index', [
            'tenants' => $tenants,
            'currentFilter' => $request->query('status', 'all'),
        ]);
    }

    /**
     * Suspend an active operational tenant.
     */
    public function suspend(Tenant $tenant)
    {
        if ($tenant->status !== 'active') {
            return back()->with('error', 'يمكن إيقاف المستأجرين النشطين فقط.');
        }

        $tenant->update(['status' => 'suspended']);

        return back()->with('success', 'تم إيقاف المستأجر بنجاح.');
    }

    /**
     * Archive a suspended operational tenant.
     */
    public function archive(Tenant $tenant)
    {
        if ($tenant->status !== 'suspended') {
            return back()->with('error', 'يجب إيقاف المستأجر (Suspend) قبل أرشفته.');
        }

        $tenant->update(['status' => 'archived']);

        return back()->with('success', 'تم أرشفة المستأجر بنجاح.');
    }

    /**
     * Restore a suspended or archived operational tenant to active state.
     */
    public function restore(Tenant $tenant)
    {
        if (! in_array($tenant->status, ['suspended', 'archived'], true)) {
            return back()->with('error', 'لا يمكن استعادة إلا المستأجرين الموقوفين أو المؤرشفين.');
        }

        $tenant->update(['status' => 'active']);

        return back()->with('success', 'تمت استعادة المستأجر بنجاح.');
    }

    /**
     * Delete an operational tenant account.
     */
    public function destroy(Tenant $tenant)
    {
        try {
            // Delete linked registration request if present
            $request = RegistrationRequest::where('slug', $tenant->id)->first();
            if ($request) {
                $request->delete();
            }

            try {
                $tenant->delete();
            } catch (\Exception $e) {
                Tenant::withoutEvents(fn () => $tenant->delete());
            }

            return back()->with('success', 'تم حذف حساب المؤسسة والبيانات التابعة له بنجاح.');
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر حذف حساب المؤسسة: '.$e->getMessage());
        }
    }
}
