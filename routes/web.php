<?php

use App\Http\Controllers\Auth\ActivationController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\Auth\UnifiedLoginController;
use App\Http\Controllers\Platform\ChangelogController;
use App\Http\Controllers\Platform\DashboardController;
use App\Http\Controllers\Platform\RegistrationRequestController;
use App\Http\Controllers\Platform\TenantLifecycleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Global / Domain-Aware Routes (Landlord vs Tenant Context Handling)
|--------------------------------------------------------------------------
*/

// Root Domain Dispatcher (Central -> Landing Page for all visitors | Tenant -> /users or /login)
Route::get('/', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (in_array($request->getHost(), $centralDomains, true)) {
        return inertia('Platform/Landing');
    }

    if (auth('web')->check()) {
        return redirect()->intended('/users');
    }

    return redirect('/login');
});

// Explicit Landing Page Route (Accessible to everyone)
Route::get('/landing', function () {
    return inertia('Platform/Landing');
})->name('landing');

// Onboarding Registration Routes (Central Domain Only - Public Access)
Route::get('/onboarding', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (! in_array($request->getHost(), $centralDomains, true)) {
        return redirect('/login');
    }

    // Public Route - Accessible to all visitors without forced redirect
    return app(OnboardingController::class)->create();
})->name('onboarding');

Route::post('/onboarding', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (! in_array($request->getHost(), $centralDomains, true)) {
        return redirect('/login');
    }

    return app(OnboardingController::class)->store($request);
});

// Account Activation Routes (Public Access)
Route::get('/activation/{token}', [ActivationController::class, 'show'])->name('activation.show');
Route::post('/activation/{token}', [ActivationController::class, 'store'])->name('activation.store');

// Unified Domain-Aware Authentication Routes (Central -> Platform Admin Login | Tenant -> Workspace Login)
Route::get('/login', function (Request $request) {
    $centralDomains = config('tenancy.central_domains', []);
    if (in_array($request->getHost(), $centralDomains, true)) {
        if (auth('platform')->check()) {
            return redirect()->intended('/admin/dashboard');
        }
    } else {
        if (auth('web')->check()) {
            return redirect()->intended('/users');
        }
    }

    return app(UnifiedLoginController::class)->create($request);
})->name('login');

// Alias route for /admin/login -> redirect to /login to prevent 404
Route::get('/admin/login', function () {
    return redirect('/login');
});

Route::post('/login', [UnifiedLoginController::class, 'store']);
Route::post('/logout', [UnifiedLoginController::class, 'destroy'])->name('logout');

// Public Platform Release History / Changelog Route (Central Domain Only)
Route::get('/changelog', [ChangelogController::class, 'index'])->name('platform.changelog');

// Platform Administration Routes (Landlord Admin Only)
Route::prefix('admin')->group(function () {
    Route::middleware('auth:platform')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('platform.dashboard');
        Route::get('/requests', [RegistrationRequestController::class, 'index'])->name('platform.requests.index');
        Route::post('/requests/{registrationRequest}/approve', [RegistrationRequestController::class, 'approve'])->name('platform.requests.approve');
        Route::post('/requests/{registrationRequest}/reject', [RegistrationRequestController::class, 'reject'])->name('platform.requests.reject');
        Route::delete('/requests/{registrationRequest}', [RegistrationRequestController::class, 'destroy'])->name('platform.requests.destroy');

        // Tenant Accounts Management Routes
        Route::get('/tenants', [TenantLifecycleController::class, 'index'])->name('platform.tenants.index');
        Route::post('/tenants/{tenant}/suspend', [TenantLifecycleController::class, 'suspend'])->name('platform.tenants.suspend');
        Route::post('/tenants/{tenant}/archive', [TenantLifecycleController::class, 'archive'])->name('platform.tenants.archive');
        Route::post('/tenants/{tenant}/restore', [TenantLifecycleController::class, 'restore'])->name('platform.tenants.restore');
        Route::delete('/tenants/{tenant}', [TenantLifecycleController::class, 'destroy'])->name('platform.tenants.destroy');
    });
});
