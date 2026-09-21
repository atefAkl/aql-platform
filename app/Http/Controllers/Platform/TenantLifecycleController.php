<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Tenant;

class TenantLifecycleController extends Controller
{
    public function suspend(Tenant $tenant)
    {
        if ($tenant->status !== 'active') {
            return back()->with('error', 'يمكن إيقاف المستأجرين النشطين فقط.');
        }

        $tenant->update(['status' => 'suspended']);

        return back()->with('success', 'تم إيقاف المستأجر بنجاح.');
    }

    public function archive(Tenant $tenant)
    {
        if ($tenant->status !== 'suspended') {
            return back()->with('error', 'يجب إيقاف المستأجر (Suspend) قبل أرشفته.');
        }

        $tenant->update(['status' => 'archived']);

        return back()->with('success', 'تم أرشفة المستأجر بنجاح.');
    }

    public function restore(Tenant $tenant)
    {
        if (! in_array($tenant->status, ['suspended', 'archived'])) {
            return back()->with('error', 'لا يمكن استعادة إلا المستأجرين الموقوفين أو المؤرشفين.');
        }

        $tenant->update(['status' => 'active']);

        return back()->with('success', 'تمت استعادة المستأجر بنجاح.');
    }
}
