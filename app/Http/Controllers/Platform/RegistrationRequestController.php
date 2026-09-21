<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Mail\RegistrationApprovedMail;
use App\Models\RegistrationRequest;
use App\Models\Tenant;
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
     * Approve a pending registration request, create Landlord Tenant Record, and issue activation token.
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

            // Create Tenant Record centrally WITHOUT triggering DB creation or migrations.
            // status is NULL explicitly as a pre-operational condition.
            Tenant::withoutEvents(function () use ($registrationRequest) {
                Tenant::create([
                    'id' => Str::slug($registrationRequest->slug),
                    'name' => $registrationRequest->organization_name,
                    'status' => null,
                ]);
            });

            // Dispatch Activation Email
            Mail::to($registrationRequest->admin_email)->send(new RegistrationApprovedMail($registrationRequest));

            return back()->with('success', 'تم اعتماد الطلب بنجاح وإنشاء سجل المستأجر الأولي وإرسال رابط التفعيل إلى بريد العميل.');
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر اعتماد الطلب: '.$e->getMessage());
        }
    }

    /**
     * Reject a pending registration request. This is a terminal state.
     */
    public function reject(RegistrationRequest $registrationRequest)
    {
        if ($registrationRequest->status !== 'pending') {
            return back()->with('error', 'لا يمكن رفض إلا الطلبات المعلقة.');
        }

        try {
            $registrationRequest->update([
                'status' => 'rejected',
            ]);

            return back()->with('success', 'تم رفض الطلب بنجاح.');
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر رفض الطلب: '.$e->getMessage());
        }
    }

    /**
     * Remove the specified registration request.
     */
    public function destroy(RegistrationRequest $registrationRequest)
    {
        try {
            // Find and delete linked tenant record in Landlord DB if present
            $tenant = Tenant::find(Str::slug($registrationRequest->slug));
            if ($tenant) {
                try {
                    $tenant->delete();
                } catch (\Exception $e) {
                    Tenant::withoutEvents(fn () => $tenant->delete());
                }
            }

            $registrationRequest->delete();

            return back()->with('success', 'تم حذف طلب التسجيل وسجل المؤسسة المرتبط به بنجاح.');
        } catch (\Exception $e) {
            return back()->with('error', 'تعذر حذف طلب التسجيل: '.$e->getMessage());
        }
    }
}
