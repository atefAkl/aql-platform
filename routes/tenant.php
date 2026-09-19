<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Tenant\UserController;
use App\Http\Controllers\Tenant\AuditLogController;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
    \App\Http\Middleware\EnsureTenantIsActive::class,
])->group(function () {
    
    // Authenticated Core App Routes
    Route::middleware(['auth', \App\Http\Middleware\EnsureUserIsActive::class])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::post('/users/{user}/permissions', [UserController::class, 'updatePermissions'])->name('users.permissions.update');
        
        Route::get('/audit', [AuditLogController::class, 'index'])->name('audit.index');

        // Dummy route for testing Module Availability (Workstream D)
        Route::get('/expenses', function () {
            return 'Expenses Module Access Granted';
        })->middleware('module:expenses');
    });

});
