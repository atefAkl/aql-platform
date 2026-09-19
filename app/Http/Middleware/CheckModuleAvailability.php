<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAvailability
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $moduleCode): Response
    {
        $tenant = tenant();
        
        if (!$tenant) {
            abort(500, 'لا يوجد سياق مؤسسة نشط.');
        }

        $subscription = \App\Models\TenantSubscription::where('tenant_id', $tenant->id)
            ->where('module_code', $moduleCode)
            ->where('status', 'active')
            ->first();

        if (!$subscription) {
            abort(403, "هذه المؤسسة غير مشتركة في تطبيق ($moduleCode) أو أن الاشتراك غير فعال.");
        }

        return $next($request);
    }
}
