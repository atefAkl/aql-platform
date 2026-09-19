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

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'بيانات الدخول غير صحيحة، يرجى التأكد من البريد وكلمة المرور.',
            ]);
        }

        $request->session()->regenerate();

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
