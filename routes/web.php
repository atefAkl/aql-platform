<?php

use App\Http\Controllers\Auth\OnboardingController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;

// Central / Local Default Routes
Route::get('/', function () {
    return (Tenant::count() === 0) ? redirect('/onboarding') : redirect('/onboarding');
});

// Public Tenant Onboarding Registration Routes (Sprint 2 / 3)
Route::get('/onboarding', [OnboardingController::class, 'create'])->name('onboarding');
Route::post('/onboarding', [OnboardingController::class, 'store']);

Route::get('/activation/{token}', [\App\Http\Controllers\Auth\ActivationController::class, 'show'])->name('activation.show');
Route::post('/activation/{token}', [\App\Http\Controllers\Auth\ActivationController::class, 'store'])->name('activation.store');

// Unified Authentication Routes (Domain-Aware)
Route::get('/login', [\App\Http\Controllers\Auth\UnifiedLoginController::class, 'create'])->name('login');
Route::post('/login', [\App\Http\Controllers\Auth\UnifiedLoginController::class, 'store']);
Route::post('/logout', [\App\Http\Controllers\Auth\UnifiedLoginController::class, 'destroy'])->name('logout');

// Platform Administration Routes
Route::prefix('admin')->group(function () {
    Route::middleware('auth:platform')->group(function () {
        Route::get('/dashboard', [\App\Http\Controllers\Platform\DashboardController::class, 'index'])->name('platform.dashboard');
        
        Route::post('/requests/{registrationRequest}/approve', [\App\Http\Controllers\Platform\RegistrationRequestController::class, 'approve'])->name('platform.requests.approve');
    });
});
