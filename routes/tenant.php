<?php

declare(strict_types=1);

use App\Http\Controllers\Tenant\AuditLogController;
use App\Http\Controllers\Tenant\UserController;
use App\Http\Middleware\EnsureTenantIsActive;
use App\Http\Middleware\EnsureUserIsActive;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware\InitializeTenancyByDomain;
use Stancl\Tenancy\Middleware\PreventAccessFromCentralDomains;

/*
|--------------------------------------------------------------------------
| Tenant Subdomain App Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'web',
    InitializeTenancyByDomain::class,
    PreventAccessFromCentralDomains::class,
    EnsureTenantIsActive::class,
])->group(function () {

    // Authenticated Core App Tenant Routes
    Route::middleware(['auth', EnsureUserIsActive::class])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::post('/users/{user}/permissions', [UserController::class, 'updatePermissions'])->name('users.permissions.update');

        Route::get('/audit', [AuditLogController::class, 'index'])->name('audit.index');

        // Module Availability Route (Workstream D)
        Route::get('/expenses', function () {
            return 'Expenses Module Access Granted';
        })->middleware('module:expenses');
    });

});
