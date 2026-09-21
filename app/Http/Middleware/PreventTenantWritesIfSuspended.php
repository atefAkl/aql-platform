<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventTenantWritesIfSuspended
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // If tenant is suspended, only allow GET requests (and HEAD/OPTIONS). Block POST/PUT/PATCH/DELETE.
        if (function_exists('tenant') && tenant() && tenant()->status === 'suspended') {
            if (! $request->isMethodSafe()) {
                abort(403, 'لا يمكن إجراء عمليات تعديل لأن هذا المستأجر في حالة إيقاف مؤقت (Read-Only Mode).');
            }
        }

        return $next($request);
    }
}
