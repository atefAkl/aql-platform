<?php

use App\Http\Controllers\Auth\ActivationController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\Auth\UnifiedLoginController;
use App\Http\Controllers\Platform\DashboardController;
use App\Http\Controllers\Platform\RegistrationRequestController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

// Central / Local Default Routes
Route::get('/', function () {
    return (Tenant::count() === 0) ? redirect('/onboarding') : redirect('/onboarding');
});

// Public Tenant Onboarding Registration Routes (Sprint 2 / 3)
Route::get('/onboarding', [OnboardingController::class, 'create'])->name('onboarding');
Route::post('/onboarding', [OnboardingController::class, 'store']);

Route::get('/activation/{token}', [ActivationController::class, 'show'])->name('activation.show');
Route::post('/activation/{token}', [ActivationController::class, 'store'])->name('activation.store');

// Unified Authentication Routes (Domain-Aware)
Route::get('/login', [UnifiedLoginController::class, 'create'])->name('login');
Route::post('/login', [UnifiedLoginController::class, 'store']);
Route::post('/logout', [UnifiedLoginController::class, 'destroy'])->name('logout');

// Platform Administration Routes
Route::prefix('admin')->group(function () {
    Route::middleware('auth:platform')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('platform.dashboard');

        Route::get('/requests', [RegistrationRequestController::class, 'index'])->name('platform.requests.index');
        Route::post('/requests/{registrationRequest}/approve', [RegistrationRequestController::class, 'approve'])->name('platform.requests.approve');
        Route::post('/requests/{registrationRequest}/suspend', [RegistrationRequestController::class, 'suspend'])->name('platform.requests.suspend');
        Route::delete('/requests/{registrationRequest}', [RegistrationRequestController::class, 'destroy'])->name('platform.requests.destroy');
    });
});
