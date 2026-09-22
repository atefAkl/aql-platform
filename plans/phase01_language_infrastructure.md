# Phase 01 — Language Infrastructure & Dynamic Direction (Release v0.5.0)

## 1. Current-State Audit Summary

| Audit Item | Current Implementation Status | Gap / Required Action for Phase 01 |
|---|---|---|
| **A. Translation System** | No active translation system in backend or frontend. | Implement clean Laravel + Inertia translation infrastructure using standard JSON/PHP translation dictionaries. |
| **B. Translation Resources** | `lang/` folder does not exist. UI strings are hardcoded in React TSX. | Create `lang/ar/platform.php` & `lang/en/platform.php` (and JSON files if needed) and share translations cleanly via Inertia. |
| **C. Locale Configuration** | `config/app.php` specifies `'locale' => 'en'`. App operates as Arabic by default. | Set default locale to `'ar'` with safe fallback to `'ar'`/`'en'`. Support N languages via `config/app.php` and `config/localization.php`. |
| **D. Locale Resolution** | No dynamic middleware exists for locale resolution. | Create `SetAppLocale` middleware to resolve locale from Session/Cookie -> Request -> App Default. |
| **E & F. Session/User Persistence** | Locale is not stored in Session or Cookie. | Store selected locale in Session & Cookie (`platform_locale`). No DB schema change required in Phase 01. |
| **G & H. Default Language & Strings** | Arabic is hardcoded in TSX views. | Move UI labels to semantic translation keys (`platform.nav.dashboard`, etc.). Set `ar` as default locale. |
| **I & J. Dynamic Layout & CSS** | Layouts (`app.blade.php`, `PlatformLayout.tsx`) have hardcoded `dir="rtl"` and `lang="ar"`. | Make `lang` and `dir` dynamic in `app.blade.php`, Inertia shared props, and Layout wrappers. Update physical CSS classes to logical properties where needed. |
| **K & L. Components & Mixed Content** | React components assume Arabic. Technical tokens (`v0.5.0`, Slugs, URLs) can break in BiDi. | Wrap technical tokens in `<span dir="ltr">` / `font-mono` to prevent BiDi corruption in both RTL and LTR. |
| **M & N. HTML Root Attributes** | `app.blade.php` has `<html lang="ar" dir="rtl">` statically. | Pass `$locale` and `$direction` dynamically to `app.blade.php` and Inertia shared props. |

---

## 2. Gap Analysis

1. **Static HTML Root**: `resources/views/app.blade.php` hardcodes `<html lang="ar" dir="rtl">`.
2. **Hardcoded React Strings**: Pages and components (`Landing.tsx`, `Dashboard.tsx`, `SidebarNav.tsx`, `RegistrationRequests/Index.tsx`, `Tenants/Index.tsx`, `Changelog.tsx`, etc.) contain hardcoded Arabic text.
3. **Missing Language Resolution**: No middleware interceptor exists to read, set, and persist app locale per HTTP request.
4. **Missing Language Switcher API & UI**: No controller endpoint or frontend component exists to allow the user to switch between Arabic (`ar` - RTL) and English (`en` - LTR) while preserving the current page.

---

## 3. Proposed Language Architecture & N-Languages Design

```text
HTTP Request (GET /admin/requests)
        │
        ▼
Middleware: SetAppLocale
  ├── 1. Check Session ('locale') / Cookie ('platform_locale')
  ├── 2. Check Supported Languages Registry (config/localization.php)
  ├── 3. Fallback to Default ('ar')
  └── 4. Execute app()->setLocale($locale)
        │
        ▼
Middleware: HandleInertiaRequests
  ├── Shares 'locale' ('ar' | 'en')
  ├── Shares 'direction' ('rtl' | 'ltr')
  └── Shares 'translations' (Platform translation dictionary)
        │
        ▼
Inertia React Frontend (Layouts & Components)
  ├── Root <html> gets dynamic lang={locale} dir={direction}
  ├── Custom hook useTranslation() / t(key) renders localized text
  └── Language Switcher Component updates locale via POST /locale
```

### Key Principles:
- **N-Languages Ready**: Supported languages are registered cleanly in `config/localization.php` as structured metadata (code, native_name, name, dir).
- **Strict Boundary Isolation**: Language switching NEVER logs out the user, NEVER alters `auth` guards, NEVER changes `tenant` context, and NEVER bypasses authorization.
- **Route Preservation**: Changing language sends an Inertia POST request to `/locale` and returns `back()`, keeping the user on their current page (`/admin/requests` stays on `/admin/requests`).

---

## 4. Storage & Persistence Decision

- **Storage**: Lightweight, zero-database overhead for Phase 01.
- **Persistence Layer**: Session (`session('locale')`) + HTTP Cookie (`platform_locale`).
- **Default Locale**: `ar` (Arabic, `dir="rtl"`).
- **Supported Locales in Phase 01**:
  - `ar`: العربية (RTL)
  - `en`: English (LTR)
- **Extensibility**: Structure designed so Phase 02/Future can seamlessly connect a Database Language Registry or Admin Management CRUD without refactoring Phase 01 components.

---

## 5. Scope & Deferred Capabilities

> [!IMPORTANT]
> - **Release Version Bump**: Update `config/releases.php` to release **`v0.5.0`** ("البنية الأساسية لتعدد اللغات والاتجاه الديناميكي - Language Infrastructure & Dynamic Direction").
> - **Default Experience**: Arabic (`ar` - RTL) remains the default language for all first-time visitors. Changing to English (`en` - LTR) switches all UI labels, layouts, and direction dynamically.
> - **Deferred Capabilities**: Admin UI for adding/editing languages from dashboard, language file uploads, translation CMS, and per-tenant language customization are explicitly deferred to future phases.

---

## 6. Proposed Code Changes

### Config & Infrastructure
#### [NEW] [config/localization.php](file:///c:/laragon/www/platform/config/localization.php)
Define supported languages registry (`ar`, `en`) with metadata (`code`, `name`, `native_name`, `dir`).

#### [MODIFY] [config/releases.php](file:///c:/laragon/www/platform/config/releases.php)
Add release entry for **`v0.5.0`** detailing Phase 01 Language Infrastructure features.

### Backend Infrastructure
#### [NEW] [app/Http/Middleware/SetAppLocale.php](file:///c:/laragon/www/platform/app/Http/Middleware/SetAppLocale.php)
Middleware to resolve app locale from session/cookie, set `app()->setLocale()`, and set safe fallback.

#### [NEW] [app/Http/Controllers/Platform/LocaleController.php](file:///c:/laragon/www/platform/app/Http/Controllers/Platform/LocaleController.php)
Action controller to update selected locale in session/cookie and return `back()`.

#### [MODIFY] [bootstrap/app.php](file:///c:/laragon/www/platform/bootstrap/app.php)
Register `SetAppLocale` middleware in web middleware group.

#### [MODIFY] [app/Http/Middleware/HandleInertiaRequests.php](file:///c:/laragon/www/platform/app/Http/Middleware/HandleInertiaRequests.php)
Share `locale`, `direction`, `supported_locales`, and `translations` dictionary with Inertia React frontend.

#### [NEW] [lang/ar/platform.php](file:///c:/laragon/www/platform/lang/ar/platform.php)
Arabic translation dictionary for platform navigation, actions, status badges, headers, and buttons.

#### [NEW] [lang/en/platform.php](file:///c:/laragon/www/platform/lang/en/platform.php)
English translation dictionary for platform navigation, actions, status badges, headers, and buttons.

#### [MODIFY] [routes/web.php](file:///c:/laragon/www/platform/routes/web.php)
Add `POST /locale` route for language selection.

### Frontend Components & Layouts
#### [MODIFY] [resources/views/app.blade.php](file:///c:/laragon/www/platform/resources/views/app.blade.php)
Bind dynamic `lang` and `dir` attributes from Inertia page props.

#### [NEW] [resources/js/Hooks/useTranslation.ts](file:///c:/laragon/www/platform/resources/js/Hooks/useTranslation.ts)
React hook providing `t(key)` helper and current `locale`/`dir` metadata.

#### [NEW] [resources/js/Components/Molecules/LanguageSwitcher.tsx](file:///c:/laragon/www/platform/resources/js/Components/Molecules/LanguageSwitcher.tsx)
Clean UI component to select and switch between Arabic and English.

#### [MODIFY] [resources/js/Layouts/PlatformLayout.tsx](file:///c:/laragon/www/platform/resources/js/Layouts/PlatformLayout.tsx)
Apply dynamic `dir` and integrate `LanguageSwitcher`.

#### [MODIFY] [resources/js/Components/Organisms/SidebarNav.tsx](file:///c:/laragon/www/platform/resources/js/Components/Organisms/SidebarNav.tsx)
Localize sidebar links, titles, and support LTR/RTL dynamic positioning.

#### [MODIFY] [resources/js/Pages/Platform/Landing.tsx](file:///c:/laragon/www/platform/resources/js/Pages/Platform/Landing.tsx)
Localize Landing page content and integrate LanguageSwitcher.

#### [MODIFY] [resources/js/Pages/Platform/Dashboard.tsx](file:///c:/laragon/www/platform/resources/js/Pages/Platform/Dashboard.tsx)
Localize Dashboard header and elements.

#### [MODIFY] [resources/js/Pages/Platform/RegistrationRequests/Index.tsx](file:///c:/laragon/www/platform/resources/js/Pages/Platform/RegistrationRequests/Index.tsx)
Localize Registration Requests page elements, table headers, and badges.

#### [MODIFY] [resources/js/Pages/Platform/Tenants/Index.tsx](file:///c:/laragon/www/platform/resources/js/Pages/Platform/Tenants/Index.tsx)
Localize Tenant Accounts page elements, table headers, and badges.

#### [MODIFY] [resources/js/Pages/Platform/Changelog.tsx](file:///c:/laragon/www/platform/resources/js/Pages/Platform/Changelog.tsx)
Localize Changelog page and maintain BiDi protection for version tokens (`v0.5.0`).

---

## 7. Verification Plan

### Automated Tests
#### [NEW] [tests/Feature/LanguageInfrastructureTest.php](file:///c:/laragon/www/platform/tests/Feature/LanguageInfrastructureTest.php)
Automated feature tests covering:
1. Default locale (`ar`) resolution and fallback to safe default when given invalid locale.
2. Locale switching via `POST /locale` persists in session & cookie.
3. Inertia shared props include correct `locale`, `direction` (`rtl` vs `ltr`), and `translations`.
4. Language switching preserves current page URI (returns `302 back()`).
5. Language switching does not affect authentication or tenant context.
6. Full regression suite (`php artisan test --compact`) passes 100%.

### Manual E2E Verification
1. **Arabic Mode (RTL)**: Open platform in Arabic. Verify navigation, layout, tables, headers, and badges align RTL.
2. **English Mode (LTR)**: Switch to English via Language Switcher. Verify layout, sidebar, headers, and tables dynamically switch to LTR.
3. **Route Preservation**: Switch language on `/admin/requests` -> verify user remains on `/admin/requests`.
4. **Auth & Tenant Isolation**: Switch language while logged in -> verify user remains logged in, auth guard untouched.
5. **Technical Tokens**: Verify version tokens (`v0.5.0`), URLs (`/admin/tenants`), and emails display cleanly without BiDi corruption.
