<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\PlatformUser;
use App\Models\RegistrationRequest;
use App\Models\Tenant;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_tenants' => Tenant::count(),
            'active_tenants' => Tenant::where('status', 'active')->count(),
            'pending_requests' => RegistrationRequest::where('status', 'pending')->count(),
            'approved_requests' => RegistrationRequest::where('status', 'approved')->count(),
            'suspended_requests' => RegistrationRequest::where('status', 'suspended')->count(),
            'platform_users' => PlatformUser::count(),
        ];

        return inertia('Platform/Dashboard', [
            'stats' => $stats,
        ]);
    }
}
