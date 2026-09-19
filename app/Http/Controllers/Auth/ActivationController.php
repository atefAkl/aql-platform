<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationRequest;
use App\Services\TenantProvisioningService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rules\Password;

class ActivationController extends Controller
{
    public function show(string $token)
    {
        $request = RegistrationRequest::where('activation_token', $token)
            ->where('status', 'approved')
            ->where('token_expires_at', '>', now())
            ->firstOrFail();

        return Inertia::render('Auth/ActivateTenant', [
            'token' => $token,
            'organization_name' => $request->organization_name,
            'admin_email' => $request->admin_email,
        ]);
    }

    public function store(Request $request, string $token, TenantProvisioningService $provisioningService)
    {
        $registrationRequest = RegistrationRequest::where('activation_token', $token)
            ->where('status', 'approved')
            ->where('token_expires_at', '>', now())
            ->firstOrFail();

        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        try {
            $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
            $domainName = $registrationRequest->slug . '.' . $centralDomain;

            $result = $provisioningService->createTenant(
                $registrationRequest->slug,
                $registrationRequest->organization_name,
                $registrationRequest->admin_name,
                $registrationRequest->admin_email,
                $validated['password'],
                $domainName
            );

            // Mark as provisioned
            $registrationRequest->update([
                'status' => 'provisioned',
                'activation_token' => null,
                'token_expires_at' => null,
            ]);

            return redirect()->to('http://' . $domainName . '/login')->with('success', 'تم تفعيل الحساب وتجهيز مؤسستك. يمكنك الآن تسجيل الدخول.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'حدث خطأ أثناء تهيئة المنصة: ' . $e->getMessage()]);
        }
    }
}
