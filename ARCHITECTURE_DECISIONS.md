# سجل القرارات المعمارية (Architecture Decision Records - ADR)

تحتوي هذه الوثيقة على سجل لجميع القرارات المعمارية والتقنية الجوهرية الخاصة بالمشروع، متضمنة السياق، البدائل المدروسة، والسبب وراء كل قرار.

---

### فهرس القرارات

| المعرف | العنوان | الحالة | التاريخ |
| :--- | :--- | :--- | :--- |
| **ADR-001** | حزمة التطوير التقنية ومحول الواجهات (Tech Stack & Inertia React Adapter) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-002** | نموذج تعدد المستأجرين وقاعدة البيانات (Multi-Tenancy & PostgreSQL Engine) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-003** | نظام المصادقة المزدوج والصلاحيات المباشرة (Dual Auth Model & Direct Permissions) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-004** | نطاق الإصدار التجريبي الأول وخطة الطريق (MVP Scope & Sprint Roadmap) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-005** | المظهر ثنائي الوضعية، الأدوار الهجينة، والتوستس (Theme Toggle, Hybrid Roles & Toasts) | 🟢 معتمد (Accepted) | 2026-09-15 |

---

## ADR-001: حزمة التطوير التقنية ومحول الواجهات (Tech Stack & Inertia React Adapter)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى اختيار حزمة تطوير تقنية (Tech Stack) متكاملة لبناء المنصة المشتركة وتطبيقات الأعمال القائمة عليها. الحزمة يجب أن تضمن السرعة الفائقة في البناء، ودعم React في الواجهات، مع تحضير الكود لاستقبال أية تكاملات خارجية مستقبليّة (3rd Party Integrations & Mobile Apps).

---

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **Backend Engine:** **PHP 8.3+ / Laravel 11** في الجذر الرئيسي مع اعتماد معمارية الموديولات المستقلة (`Domain-Driven Modular Architecture`).
2. **Frontend & Fullstack Adapter (تطبيق الويب الرئيسي):**
   - **React (TypeScript) + Inertia.js + Tailwind CSS + Shadcn UI** كمحول الواجهات الرئيسي للمنصة وتطبيقاتها، مما يمنحنا قوة وسلاسة React مع السرعة والربط المباشر بـ Laravel controllers دون كتابة boilerplate زائدة.
3. **External API Layer (الشركاء والخدمات الخارجية):**
   - تخصيص مسارات `routes/api.php` لبناء **RESTful APIs** معزولة لتغذية تطبيقات الموبايل (React Native) والمطورين الخارجيين مستقبلاً من خلال نفس الـ Domain Services.
4. **Caching & Queues:** **Redis** لإدارة الـ Queues، والـ Cache، والـ Real-time WebSockets.
5. **File Storage:** Local System Storage للتطوير المحلي، و MinIO / AWS S3 لبيئة الإنتاج.

---

## ADR-002: نموذج تعدد المستأجرين وعزل البيانات (Multi-Tenancy & PostgreSQL Engine)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى تحديد الآلية المعمارية لعزل قواعد بيانات المستأجرين (Multi-Tenancy Architecture)، وتثبيت نوع محرك قاعدة البيانات المستخدم في بيئتي التطوير والإنتاج لضمان عدم وجود أي تعارض في الـ Migrations أو الاستعلامات.

---

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **محرك قاعدة البيانات التأسيسي (Unified Database Engine):**
   - اعتماد **PostgreSQL 16+ في جميع البيئات (التطوير المحلي + بيئة الإنتاج Production)**.
   - **السبب:** منع أي تعارض مستقبلي بين محركات قواعد البيانات (مثل اختلافات الـ Enums والـ JSONB والـ Case Sensitivity بين MySQL و Postgres)، وضمان مطابقة الـ Migrations والـ Row-Level Security 100% من اليوم الأول.
2. **نموذج العزل:** اعتماد **Database Per Tenant (قاعدة بيانات مستقلة لكل مستأجر)**.
3. **قاعدة البيانات المركزية (Landlord System Database):**
   - قاعدة بيانات مركزية تسمى `landlord_db` تحتوي على الجداول الأساسية: سجل المستأجرين (`tenants`)، النطاقات (`domains`)، والاشتراكات (`subscriptions`).
4. **قواعد بيانات المستأجرين (Tenant Databases):**
   - قاعدة بيانات مستقلة لكل مستأجر (مثل `tenant_acme_db`) تنشأ وتجهز بالـ Schemas تلقائياً عند التسجيل.
5. **حزمة التنفيذ المعتمدة:**
   - اعتماد حزمة **`stancl/tenancy`** في Laravel 11 للتحويل التلقائي لقاعدة بيانات المستأجر أثناء تنقل الطلبات.

---

## ADR-003: نظام المصادقة المزدوج والصلاحيات المباشرة (Dual Auth Model & Direct Permissions)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى حسم وتفصيل نوع المصادقة (Authentication Model) المستخدم لكل من **تطبيق الويب الرئيسي (Inertia + React)** و **الـ APIs الخارجية للشركاء (3rd Party APIs)**، وتثبيت نظام الصلاحيات المباشرة.

---

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **نموذج المصادقة المزدوج (Dual Guard Authentication Model via Laravel Sanctum):**
   - **أولاً: لتطبيق الويب الرئيسي (Inertia.js + React):**
     * اعتماد **Stateful Cookie/Session Authentication** (عبر Laravel Sanctum Web Guard).
     * **السبب:** يوفر أعلى معايير الحماية (HTTP-Only Cookies + SameSite Protection + Automatic CSRF Tokens) ويعمل بسلاسة مطلقة مع Inertia.js دون الحاجة لتخزين Tokens في الـ LocalStorage المعرضة للـ XSS.
   - **ثانياً: للـ APIs الخارجية وتطبيقات الموبايل (`routes/api.php`):**
     * اعتماد **Stateless Bearer Tokens** (Laravel Sanctum Personal Access Tokens).
     * يشتمل الـ Token على `tenant_id` والصلاحيات الممنوحة للطرف الخارجي، مع دعم تاريخ الانتهاء (Expiration) والـ Revocation.

2. **نظام الصلاحيات المباشرة (Permission-Centric Authorization):**
   - النواة الأساسية للتحكم في الوصول هي **الصلاحية الدقيقة (Atomic Permission)** (مثل: `expenses.approve`, `inventory.products.view`).
   - إسناد الصلاحية **للمستخدم مباشرة (Direct User Permissions)** بصرف النظر عن مسمساه الوظيفي.
   - توفير "قوالب أدوار" (Role Templates) اختيارية فقط لتسهيل الإسناد الجماعي.

3. **تأجيل البوابات الخارجية:**
   - استبعاد بوابات العملاء والموردين الخارجية من نطاق الـ MVP وتأجيلها للمراحل القادمة.

---

## ADR-004: نطاق الإصدار التجريبي الأول ورخطة الطريق (MVP Scope & Sprint Roadmap)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. القرار المصادق عليه (Final Decision & Scope)

1. **تطبيق الأعمال الأول للتحقق (First Validation Module):**
   - اعتماد **موديول إدارة المصروفات المصغر (Expenses Management Module)** ليكون أول موديول يُبنى كلياً فوق النواة.
2. **خطة السبرنتات (Sprint Roadmap):**
   - **Sprint 1:** بناء النواة المشتركة (Platform Core) + PostgreSQL Multi-Tenancy Auto Provisioning + Dual Auth & Permission Engine + Core Inertia React Shell + 🧪 Test 1.
   - **Sprint 2:** بناء موديول المصروفات (Expenses Module) + 🚀 Test 2 (تجربة حية للبرودكت أونر والتستر).

---

## ADR-005: المظهر ثنائي الوضعية، الأدوار الهجينة، والتوستس (Theme Toggle, Hybrid Roles & Toasts)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى توثيق وحسم ثلاثة قرارات معمارية وتصميمية عاجلة بناءً على التوجيهات الأخيرة للـ Product Owner:
1. دعم التبديل السلس بين المظهر الفاتح والداكن (Light & Dark Theme Toggle).
2. إدراج وتجسيد نظام "الأدوار الهجينة" (Hybrid Role Templates) بوضوح إلى جانب الصلاحيات الفردية المباشرة.
3. توحيد ظهور رسائل التنبيهات والإشعارات (Toasts Notifications) في الزاوية العلوية المقابلة للشريط الجانبي (Top-Left Toast Notifications in RTL).

---

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **دعم المظهر ثنائي الوضعية (Light / Dark Theme Support):**
   - توفير مفتاح تبديل في شريط الرأس (`PlatformLayout.jsx`) يتيح التبديل الفوري بين المظهر الداكن (Dark Slate) والمظهر الفاتح (Clean Light Slate).
   - حفظ التفضيل تلقائياً في الـ `localStorage` والـ DOM `class="dark"`.

2. **نظام الأدوار الهجينة (Hybrid Roles & Direct Permissions System):**
   - **قوالب الأدوار (Role Templates):** إضافة جدول `roles` وجدول `role_permissions` في قاعدة بيانات المستأجر، حيث يحتوي كل دور (مثل: "مدير نظام", "محاسب", "مدير مخزن") على حزمة صلاحيات افتراضية مسبقة.
   - **المرونة الفردية (Individual Overrides):** تتيح شاشة إدارة الموظفين اختيار "دور وظيفي" للمستخدم مع بقاء القدرة الكاملة للأدمن على تعديل وإضافة/إلغاء أية صلاحية سريعة صريحة للموظف كـ Direct Permission.

3. **رسائل التنبيهات والـ Toasts (Toast Notification System):**
   - استبدال التنبيهات المباشرة بنظام **Toast Notifications** تفاعلي، يظهر في الزاوية العلوية اليسرى (`top-4 left-4`) وهي الجهة المقابلة للشريط الجانبي الأيمن في التنسيق العربي (RTL).
   - توفير درجات التنبيه الأربعة: النجاح (Success - Emerald)، الخطأ (Error - Red)، التحذير (Warning - Amber)، والمعلومات (Info - Blue) مع مؤقت اختفاء آلي وزر إغلاق سريع.

