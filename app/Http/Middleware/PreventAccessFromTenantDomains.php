<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventAccessFromTenantDomains
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $centralDomains = config('tenancy.central_domains', []);

        if (! in_array($request->getHost(), $centralDomains, true)) {
            // Request is on a tenant subdomain trying to access a central-only route (like /onboarding)
            return redirect('/login');
        }

        return $next($request);
    }
}
