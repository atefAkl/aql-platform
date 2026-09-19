<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Mail\RegistrationApprovedMail;
use App\Models\RegistrationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RegistrationRequestController extends Controller
{
    /**
     * Display a listing of registration requests.
     */
    public function index(Request $request)
    {
        $query = RegistrationRequest::query();

        if ($request->filled('status')) {
            $query->where('status', $request->query('status'));
        }

        $requests = $query->latest()->get();

        return inertia('Platform/RegistrationRequests/Index', [
            'requests' => $requests,
            'currentFilter' => $request->query('status', 'all'),
        ]);
    }

    /**
     * Approve a pending registration request and issue activation token.
     */
    public function approve(RegistrationRequest $registrationRequest)
    {
        if ($registrationRequest->status !== 'pending') {
            return back()->with('error', 'لا يمكن اعتماد طلب غير معلق.');
        }

        try {
            $activationToken = Str::random(64);

            $registrationRequest->update([
                'status' => 'approved',
                'activation_token' => $activationToken,
                'token_expires_at' => now()->addDays(3),
            ]);

            // Dispatch Activation Email
            Mail::to($registrationRequest->admin_email)->send(new RegistrationApprovedMail($registrationRequest));

            return back()->with('success', 'تم اعتماد الطلب بنجاح وإرسال رابط التفعيل إلى بريد العميل.');
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر اعتماد الطلب: '.$e->getMessage());
        }
    }

    /**
     * Toggle or set status of a registration request to suspended.
     */
    public function suspend(RegistrationRequest $registrationRequest)
    {
        try {
            $newStatus = ($registrationRequest->status === 'suspended') ? 'pending' : 'suspended';
            $message = ($newStatus === 'suspended')
                ? 'تم تعليق وإيقاف الطلب بنجاح.'
                : 'تم استعادة الطلب إلى الحالة المعلقة.';

            $registrationRequest->update([
                'status' => $newStatus,
            ]);

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر تعديل حالة الطلب: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified registration request.
     */
    public function destroy(RegistrationRequest $registrationRequest)
    {
        try {
            $name = $registrationRequest->organization_name;
            $registrationRequest->delete();

            return back()->with('success', "تم حذف طلب تسجيل ({$name}) بنجاح.");
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر حذف الطلب: '.$e->getMessage());
        }
    }
}
