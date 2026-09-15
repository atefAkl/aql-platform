<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\OnboardingController;
use App\Http\Controllers\Tenant\UserController;
use App\Http\Controllers\Tenant\AuditLogController;
use App\Models\Tenant;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Central / Local Default Routes
Route::get('/', function () {
    return (Tenant::count() === 0) ? redirect('/onboarding') : redirect('/login');
});

// Public Tenant Onboarding Registration Routes (Sprint 2)
Route::get('/onboarding', [OnboardingController::class, 'create'])->name('onboarding');
Route::post('/onboarding', [OnboardingController::class, 'store']);

// Authentication Routes
Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');


// Authenticated Core App Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::post('/users/{user}/permissions', [UserController::class, 'updatePermissions'])->name('users.permissions.update');
    
    Route::get('/audit', [AuditLogController::class, 'index'])->name('audit.index');
});
