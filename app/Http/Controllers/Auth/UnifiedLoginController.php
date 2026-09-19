<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;

class UnifiedLoginController extends Controller
{
    protected function isCentralDomain(Request $request)
    {
        $host = $request->getHost();
        $centralDomains = config('tenancy.central_domains');
        return in_array($host, $centralDomains);
    }

    protected function initializeTenantIfNeeded(Request $request)
    {
        if (!function_exists('tenant') || !tenant()) {
            $tenant = Tenant::whereHas('domains', function ($query) use ($request) {
                $query->where('domain', $request->getHost());
            })->firstOrFail();
            
            tenancy()->initialize($tenant);
        }
    }

    public function create(Request $request)
    {
        if ($this->isCentralDomain($request)) {
            return app(\App\Http\Controllers\Platform\AuthController::class)->create();
        }

        $this->initializeTenantIfNeeded($request);
        return app(\App\Http\Controllers\Auth\AuthenticatedSessionController::class)->create();
    }

    public function store(Request $request)
    {
        if ($this->isCentralDomain($request)) {
            return app(\App\Http\Controllers\Platform\AuthController::class)->store($request);
        }

        $this->initializeTenantIfNeeded($request);
        return app(\App\Http\Controllers\Auth\AuthenticatedSessionController::class)->store($request);
    }

    public function destroy(Request $request)
    {
        if ($this->isCentralDomain($request)) {
            return app(\App\Http\Controllers\Platform\AuthController::class)->destroy($request);
        }

        $this->initializeTenantIfNeeded($request);
        return app(\App\Http\Controllers\Auth\AuthenticatedSessionController::class)->destroy($request);
    }
}
