<?php

namespace App\Http\Controllers\Shared;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;

class LocaleController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'locale' => 'required|string|in:'.implode(',', array_keys(config('localization.supported', []))),
        ]);

        $locale = $request->input('locale');

        Session::put('locale', $locale);
        Cookie::queue(Cookie::make('platform_locale', $locale, 60 * 24 * 365)); // 1 year

        return back();
    }
}
