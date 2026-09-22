<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RegistrationRequest;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Models\Domain;

class OnboardingController extends Controller
{
    /**
     * Display the public tenant onboarding registration view.
     */
    public function create(): Response
    {
        $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        $centralDomain = preg_replace('/^www\./', '', $centralDomain);

        return Inertia::render('Auth/Onboarding', [
            'central_domain' => $centralDomain,
        ]);
    }

    /**
     * Handle tenant registration & provisioning submission.
     */
    public function store(Request $request)
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
                    if (Tenant::on('pgsql')->where('id', $slug)->exists() || RegistrationRequest::where('slug', $slug)->exists()) {
                        $fail('المعرف الفريد للمؤسسة مستخدم بالفعل أو قيد المراجعة، يرجى اختيار معرف آخر.');
                    }
                },
            ],
            'admin_name' => ['required', 'string', 'max:255'],
            'admin_email' => ['required', 'string', 'email', 'max:255'],
        ], [
            'organization_name.required' => 'يرجى كتابة اسم المؤسسة.',
            'slug.required' => 'يرجى كتابة المعرف الفريد للمؤسسة (Slug).',
            'slug.alpha_dash' => 'يجب أن يحتوي المعرف على حروف وأرقام وشرطات فقط.',
            'admin_name.required' => 'يرجى إدخال اسم مسؤول النظام.',
            'admin_email.required' => 'يرجى إدخال البريد الإلكتروني للمسؤول.',
            'admin_email.email' => 'صيغة البريد الإلكتروني غير صحيحة.',
        ]);

        $slug = Str::slug($validated['slug']);
        $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        $centralDomain = preg_replace('/^www\./', '', $centralDomain);
        $domainName = $slug.'.'.$centralDomain;

        // Additional uniqueness check for domain mapping
        if (Domain::where('domain', $domainName)->exists()) {
            return back()->withErrors([
                'slug' => 'النطاق المرتبط بهذا المعرف مستخدم بالفعل.',
            ]);
        }

        try {
            RegistrationRequest::create([
                'organization_name' => $validated['organization_name'],
                'slug' => $slug,
                'admin_name' => $validated['admin_name'],
                'admin_email' => $validated['admin_email'],
                'status' => 'pending',
            ]);

            return redirect()->route('onboarding')->with('success', 'تم إرسال طلب التسجيل بنجاح! طلبك الآن قيد المراجعة.');
        } catch (\Throwable $e) {
            return back()->withErrors([
                'organization_name' => 'تعذر إرسال الطلب: '.$e->getMessage(),
            ]);
        }
    }
}
