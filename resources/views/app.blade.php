<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ config('localization.supported.' . app()->getLocale() . '.dir', 'rtl') }}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>منصة إدارة الأعمال المشتركة</title>
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead

  </head>
  <body class="bg-slate-900 text-slate-100 antialiased min-h-screen">
    @inertia
  </body>
</html>
