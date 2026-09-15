<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle an incoming authentication request (Stateful Cookie/Session Auth - ADR-003).
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        $email = $credentials['email'];

        // Verify if current tenant database contains the requested user
        $userExistsInCurrentTenant = (function_exists('tenant') && tenant())
            ? User::where('email', $email)->exists()
            : false;

        // If user is not in current tenant DB, search across active tenants
        if (! $userExistsInCurrentTenant) {
            $tenants = Tenant::where('status', 'active')->get();
            $targetTenant = null;

            foreach ($tenants as $t) {
                $exists = $t->run(function () use ($email) {
                    return User::where('email', $email)->exists();
                });

                if ($exists) {
                    $targetTenant = $t;
                    break;
                }
            }

            if ($targetTenant) {
                if (function_exists('tenant') && tenant()) {
                    tenancy()->end();
                }
                tenancy()->initialize($targetTenant);
                $request->session()->put('tenant_id', $targetTenant->id);
            }
        }

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.',
            ]);
        }

        $request->session()->regenerate();
        if (function_exists('tenant') && tenant()) {
            $request->session()->put('tenant_id', tenant('id'));
        }

        // Selective Audit Log for Security-Sensitive Login Event
        AuditLogService::record(
            'AUTH_LOGIN',
            'User',
            Auth::id() . '',
            "تسجيل دخول ناجح للمستخدم: " . Auth::user()->email
        );

        return redirect()->intended('/users');
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            AuditLogService::record(
                'AUTH_LOGOUT',
                'User',
                $user->id . '',
                "تسجيل خروج للمستخدم: " . $user->email
            );
        }

        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
