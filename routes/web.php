<?php

use App\Http\Controllers\Auth\ActivationController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\Auth\UnifiedLoginController;
use App\Http\Controllers\Platform\DashboardController;
use App\Http\Controllers\Platform\RegistrationRequestController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Global / Domain-Aware Routes (Landlord vs Tenant Context Handling)
|--------------------------------------------------------------------------
*/

// Root Domain Dispatcher (Central -> /onboarding | Tenant -> /login)
Route::get('/', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (in_array($request->getHost(), $centralDomains, true)) {
        return redirect('/onboarding');
    }

    return redirect('/login');
});

// Onboarding Registration Routes (Central Domain Only - Tenant subdomains redirect to /login)
Route::get('/onboarding', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (! in_array($request->getHost(), $centralDomains, true)) {
        return redirect('/login');
    }

    return app(OnboardingController::class)->create();
})->name('onboarding');

Route::post('/onboarding', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (! in_array($request->getHost(), $centralDomains, true)) {
        return redirect('/login');
    }

    return app(OnboardingController::class)->store($request);
});

// Account Activation Routes
Route::get('/activation/{token}', [ActivationController::class, 'show'])->name('activation.show');
Route::post('/activation/{token}', [ActivationController::class, 'store'])->name('activation.store');

// Unified Domain-Aware Authentication Routes (Central -> Platform Admin Login | Tenant -> Workspace Login)
Route::get('/login', [UnifiedLoginController::class, 'create'])->name('login');
Route::post('/login', [UnifiedLoginController::class, 'store']);
Route::post('/logout', [UnifiedLoginController::class, 'destroy'])->name('logout');

// Platform Administration Routes (Landlord Admin Only)
Route::prefix('admin')->group(function () {
    Route::middleware('auth:platform')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('platform.dashboard');
        Route::get('/requests', [RegistrationRequestController::class, 'index'])->name('platform.requests.index');
        Route::post('/requests/{registrationRequest}/approve', [RegistrationRequestController::class, 'approve'])->name('platform.requests.approve');
        Route::post('/requests/{registrationRequest}/reject', [RegistrationRequestController::class, 'reject'])->name('platform.requests.reject');
        Route::delete('/requests/{registrationRequest}', [RegistrationRequestController::class, 'destroy'])->name('platform.requests.destroy');

        // Tenant Management Routes
        Route::post('/tenants/{tenant}/suspend', [\App\Http\Controllers\Platform\TenantLifecycleController::class, 'suspend'])->name('platform.tenants.suspend');
        Route::post('/tenants/{tenant}/archive', [\App\Http\Controllers\Platform\TenantLifecycleController::class, 'archive'])->name('platform.tenants.archive');
        Route::post('/tenants/{tenant}/restore', [\App\Http\Controllers\Platform\TenantLifecycleController::class, 'restore'])->name('platform.tenants.restore');
    });
});

