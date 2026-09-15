<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\TenantProvisioningService;
use Stancl\Tenancy\Database\Models\Domain;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Validation\Rule;

class OnboardingController extends Controller
{
    /**
     * Display the public tenant onboarding registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Onboarding');
    }

    /**
     * Handle tenant registration & provisioning submission.
     */
    public function store(Request $request, TenantProvisioningService $provisioningService)
    {
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }

        $validated = $request->validate([
            'organization_name' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'alpha_dash',
                'max:50',
                function ($attribute, $value, $fail) {
                    $slug = Str::slug($value);
                    if (Tenant::on('pgsql')->where('id', $slug)->exists()) {
                        $fail('المعرف الفريد للمؤسسة مستخدم بالفعل، يرجى اختيار معرف آخر.');
                    }
                },
            ],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'organization_name.required' => 'يرجى كتابة اسم المؤسسة.',
            'slug.required' => 'يرجى كتابة المعرف الفريد للمؤسسة (Slug).',
            'slug.alpha_dash' => 'يجب أن يحتوي المعرف على حروف وأرقام وشرطات فقط.',
            'admin_name.required' => 'يرجى إدخال اسم مسؤول النظام.',
            'admin_email.required' => 'يرجى إدخال البريد الإلكتروني للمسؤول.',
            'admin_email.email' => 'صيغة البريد الإلكتروني غير صحيحة.',
            'password.required' => 'يرجى إدخال كلمة المرور.',
            'password.min' => 'كلمة المرور يجب أن لا تقل عن 8 أحرف.',
            'password.confirmed' => 'تأكيد كلمة المرور غير مطابق.',
        ]);


        $slug = Str::slug($validated['slug']);
        $domainName = $slug . '.localhost';

        // Additional uniqueness check for domain mapping
        if (Domain::where('domain', $domainName)->exists()) {
            return back()->withErrors([
                'slug' => 'النطاق المرتبط بهذا المعرف مستخدم بالفعل.',
            ]);
        }

        try {
            $result = $provisioningService->createTenant(
                $slug,
                $validated['organization_name'],
                $validated['admin_name'],
                $validated['admin_email'],
                $validated['password'],
                $domainName
            );

            /** @var Tenant $tenant */
            $tenant = $result['tenant'];
            /** @var \App\Models\User $adminUser */
            $adminUser = $result['admin_user'];

            // Initialize tenancy context & establish authenticated admin session
            if (function_exists('tenant') && tenant()) {
                tenancy()->end();
            }
            tenancy()->initialize($tenant);

            $request->session()->put('tenant_id', $tenant->id);

            Auth::login($adminUser);
            $request->session()->regenerate();

            return redirect()->route('users.index')->with('success', "تم إنشاء وتجهيز بيئة مؤسسة ({$tenant->name}) بنجاح! مرحباً بك.");
        } catch (\Throwable $e) {
            return back()->withErrors([
                'organization_name' => 'تعذر إكمال عملية التجهيز: ' . $e->getMessage(),
            ]);
        }
    }
}
