<?php

use App\Http\Middleware\CheckModuleAvailability;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\InitializeTenancyIfTenantDomain;
use App\Http\Middleware\SetAppLocale;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(prepend: [
            InitializeTenancyIfTenantDomain::class,
        ]);

        $middleware->web(append: [
            SetAppLocale::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'module' => CheckModuleAvailability::class,
        ]);

        $middleware->redirectUsersTo(function (Request $request) {
            return route('login', ['next' => $request->fullUrl()]);
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) {
            if ($response->getStatusCode() === 419) {
                return back()->with([
                    'error' => 'انتهت صلاحية الجلسة أو الصفحة بسبب عدم النشاط لفترة طويلة، يرجى المحاولة مرة أخرى.',
                ]);
            }

            return $response;
        });
    })->create();
