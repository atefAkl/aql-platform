<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function create()
    {
        return inertia('Platform/Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (auth()->guard('platform')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            $next = $request->input('next');
            if ($next && (str_starts_with($next, '/') || parse_url($next, PHP_URL_HOST) === $request->getHost())) {
                return redirect($next);
            }

            return redirect()->intended('/admin/dashboard');
        }

        return back()->withErrors([
            'email' => 'البيانات غير صحيحة.',
        ])->onlyInput('email');
    }

    public function destroy(Request $request)
    {
        auth()->guard('platform')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/login');
    }
}
