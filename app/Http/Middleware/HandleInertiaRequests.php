<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Auto-initialize Tenancy from Session if not initialized
        if ((! function_exists('tenant') || ! tenant()) && $request->session()->has('tenant_id')) {
            $tenantId = $request->session()->get('tenant_id');
            $tenant = Tenant::find($tenantId);
            if ($tenant) {
                tenancy()->initialize($tenant);
            }
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'role_title' => $request->user()->role_title,
                    'permissions' => $request->user()->permissions->pluck('code'),
                ] : null,
            ],
            'tenant' => function () {
                return function_exists('tenant') && tenant() ? [
                    'id' => tenant('id'),
                    'name' => tenant('name'),
                    'status' => tenant('status'),
                ] : null;
            },

            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ]);
    }
}
