<?php

namespace App\Http\Middleware;

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
        $user = $request->user('platform') ?? $request->user('web') ?? $request->user();

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role_title' => $user->role_title ?? ($request->user('platform') ? 'Platform Admin' : 'User'),
                    'permissions' => method_exists($user, 'permissions') && $user->permissions
                        ? $user->permissions->pluck('code')
                        : [],
                ] : null,
                'guard' => $request->user('platform') ? 'platform' : ($request->user('web') ? 'web' : null),
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

            // Language & Localization
            'locale' => fn () => app()->getLocale(),
            'direction' => fn () => config('localization.supported.'.app()->getLocale().'.dir', 'rtl'),
            'supported_locales' => fn () => config('localization.supported', []),
            'translations' => function () {
                return [
                    'common' => __('common'),
                    'platform' => __('platform'),
                    'tenant' => __('tenant'),
                ];
            },
        ]);
    }
}
