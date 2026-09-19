<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\RegistrationRequest;
use App\Services\TenantProvisioningService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RegistrationRequestController extends Controller
{
    public function approve(RegistrationRequest $registrationRequest)
    {
        if ($registrationRequest->status !== 'pending') {
            return back()->withErrors(['error' => 'لا يمكن اعتماد طلب غير معلق.']);
        }

        try {
            // Generate secure activation token
            $activationToken = Str::random(64);

            $registrationRequest->update([
                'status' => 'approved',
                'activation_token' => $activationToken,
                'token_expires_at' => now()->addDays(3),
            ]);

            // In a real scenario, we would dispatch an email here:
            // Mail::to($registrationRequest->admin_email)->send(new TenantActivationMail($registrationRequest, $activationToken));

            return back()->with('success', 'تم اعتماد الطلب. يجب على المؤسسة استكمال التفعيل باستخدام الرابط المرسل لهم.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'تعذر اعتماد الطلب: ' . $e->getMessage()]);
        }
    }
}
