<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;

class EnsureTenantInitialized
{
    public function handle(Request $request, Closure $next)
    {
        if (! function_exists('tenant') || ! tenant()) {
            $tenantId = $request->hasSession() ? $request->session()->get('tenant_id') : null;

            if ($tenantId) {
                $tenant = Tenant::find($tenantId);
                if ($tenant) {
                    tenancy()->initialize($tenant);
                }
            }
        }

        return $next($request);
    }
}

