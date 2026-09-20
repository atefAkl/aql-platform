<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InitializeTenancyIfTenantDomain
{
    /**
     * Handle an incoming request.
     *
     * If the incoming request domain is not a central domain, initialize tenancy
     * BEFORE session and CSRF middleware execute so that sessions and auth guards
     * operate on the correct database context.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $centralDomains = config('tenancy.central_domains', []);

        if (! in_array($host, $centralDomains, true)) {
            if (! function_exists('tenant') || ! tenant()) {
                $tenant = Tenant::whereHas('domains', function ($query) use ($host) {
                    $query->where('domain', $host);
                })->first();

                if ($tenant) {
                    tenancy()->initialize($tenant);
                }
            }
        }

        return $next($request);
    }
}
