<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetAppLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $supportedLocales = config('localization.supported', ['ar' => ['dir' => 'rtl']]);
        $defaultLocale = config('localization.default', 'ar');

        $locale = Session::get('locale');

        if (! $locale) {
            $locale = $request->cookie('platform_locale');
        }

        if (! $locale || ! array_key_exists($locale, $supportedLocales)) {
            $locale = $defaultLocale;
        }

        App::setLocale($locale);
        Log::info('SetAppLocale ran. Locale set to: '.$locale);

        return $next($request);
    }
}
