<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureTenantIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (function_exists('tenant') && tenant() && tenant()->status !== 'provisioned' && tenant()->status !== 'active') {
            abort(403, 'هذه المؤسسة غير نشطة. يرجى التواصل مع إدارة المنصة.');
        }

        return $next($request);
    }
}
