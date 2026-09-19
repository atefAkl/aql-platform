# سجل القرارات المعمارية (Architecture Decision Records - ADR)

تحتوي هذه الوثيقة على سجل لجميع القرارات المعمارية والتقنية الجوهرية الخاصة بالمشروع، متضمنة السياق، البدائل المدروسة، والسبب وراء كل قرار.

---

## فهرس القرارات

| المعرف      | العنوان                                                                                            | الحالة              | التاريخ    |
| :---------- | :------------------------------------------------------------------------------------------------- | :------------------ | :--------- |
| **ADR-001** | حزمة التطوير التقنية ومحول الواجهات (Tech Stack & Inertia React Adapter)                           | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-002** | نموذج تعدد المستأجرين وقاعدة البيانات (Multi-Tenancy & PostgreSQL Engine)                          | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-003** | نظام المصادقة المزدوج والصلاحيات المباشرة (Dual Auth Model & Direct Permissions)                   | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-004** | نطاق الإصدار التجريبي الأول وخطة الطريق (MVP Scope & Sprint Roadmap)                               | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-005** | المظهر ثنائي الوضعية، الأدوار الهجينة، والتوستس (Theme Toggle, Hybrid Roles & Toasts)              | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-006** | حوكمة السلطة المعمارية وتوزيع المسؤوليات (Agent Authority & Architectural Governance)              | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-007** | دورة حياة المستأجر وتجهيزه (Tenant Lifecycle & Provisioning)                                       | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-008** | حالة المنصة الصفرية والتسجيل الأول (Zero-State Platform & First Tenant Onboarding)                 | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-009** | تحديد سياق المستأجر وعزل البيانات (Deterministic Tenant Resolution & Data Isolation)               | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-010** | حدود إدارة المنصة وعزل هوية المستخدمين (Platform Administration Boundary & Identity Isolation)     | 🟢 معتمد (Accepted) | 2026-09-17 |
| **ADR-011** | الموديولات كتطبيقات مستقلة قابلة للتركيب (Platform Modules as Independent Applications)            | 🟢 معتمد (Accepted) | 2026-09-17 |
| **ADR-012** | تكامل الموديولات من خلال عقود API (Module Integration Through API Contracts)                       | 🟢 معتمد (Accepted) | 2026-09-17 |
| **ADR-013** | دورة حياة تسجيل المستأجر وتجهيزه (Tenant Registration & Lifecycle)                                 | 🟢 معتمد (Accepted) | 2026-09-17 |
| **ADR-014** | حالات التشغيل وسياسات الموديولات (Tenant Operational States & Module Policies)                     | 🟢 معتمد (Accepted) | 2026-09-17 |
| **ADR-015** | فصل تركيب الموديول عن تمكينه للمستأجر (Module Installation vs Tenant Enablement)                   | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-016** | ملكية نطاق وبيانات الموديول (Module Domain & Data Ownership)                                       | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-017** | عقد تعريف الموديول للمنصة (Module Metadata / Manifest Contract)                                    | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-018** | تسلسل الوصول: Subscription وEntitlement وPermission                                                | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-019** | نطاقات الإعدادات وخدمات المنصة العامة للموديولات (Configuration Scopes & Public Platform Services) | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-020** | مسؤولية التدقيق وعزل سياقات الخدمات (Platform Audit & Context Separation)                          | 🟢 معتمد (Accepted) | 2026-09-18 |

<!-- markdownlint-disable MD060 -->

| **ADR-021** | تحديد طلب المستأجر وسياق الوصول (Tenant Request Resolution & Access Context) | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-022** | ملكية الموديول وحدود المنصة (Module Ownership & Platform Boundary) | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-023** | تجهيز الموديول والتراجع (Module Provisioning & Rollback) | 🟢 معتمد (Accepted) | 2026-09-18 |
| **ADR-024** | إزالة تجهيز الموديول (Module Deprovisioning) | 🟢 معتمد (Accepted) | 2026-09-18 |

<!-- markdownlint-enable MD060 -->

---

## ADR-001: حزمة التطوير التقنية ومحول الواجهات (Tech Stack & Inertia React Adapter)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 1.1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى اختيار حزمة تطوير تقنية (Tech Stack) متكاملة لبناء المنصة المشتركة وتطبيقات الأعمال القائمة عليها. الحزمة يجب أن تضمن السرعة الفائقة في البناء، ودعم React في الواجهات، مع تحضير الكود لاستقبال أية تكاملات خارجية مستقبليّة (3rd Party Integrations & Mobile Apps).

---

### 1.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **Backend Engine:** **PHP 8.3+ / Laravel 11** في الجذر الرئيسي مع اعتماد معمارية الموديولات المستقلة (`Domain-Driven Modular Architecture`).
2. **Frontend & Fullstack Adapter (تطبيق الويب الرئيسي):**
    - **React (TypeScript) + Inertia.js + Tailwind CSS + Shadcn UI** كمحول الواجهات الرئيسي للمنصة وتطبيقاتها، مما يمنحنا قوة وسلاسة React مع السرعة والربط المباشر بـ Laravel controllers دون كتابة boilerplate زائدة.
3. **External API Layer (الشركاء والخدمات الخارجية):**
    - تخصيص مسارات `routes/api.php` لبناء **RESTful APIs** معزولة لتغذية تطبيقات الموبايل (React Native) والمطورين الخارجيين مستقبلاً من خلال نفس الـ Domain Services.
4. **Caching & Queues:** **Redis** لإدارة الـ Queues، والـ Cache، والـ Real-time WebSockets.
5. **File Storage:** Local System Storage للتطوير المحلي، و MinIO / AWS S3 لبيئة الإنتاج.

---

## ADR-002: نموذج تعدد المستأجرين وعزل البيانات (Multi-Tenancy & PostgreSQL Engine)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 2.1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى تحديد الآلية المعمارية لعزل قواعد بيانات المستأجرين (Multi-Tenancy Architecture)، وتثبيت نوع محرك قاعدة البيانات المستخدم في بيئتي التطوير والإنتاج لضمان عدم وجود أي تعارض في الـ Migrations أو الاستعلامات.

---

### 2.2. القرار النهائي المصادق عليه (Final Decision & Approval)

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

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 3.1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى حسم وتفصيل نوع المصادقة (Authentication Model) المستخدم لكل من **تطبيق الويب الرئيسي (Inertia + React)** و **الـ APIs الخارجية للشركاء (3rd Party APIs)**، وتثبيت نظام الصلاحيات المباشرة.

---

### 3.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **نموذج المصادقة المزدوج (Dual Guard Authentication Model via Laravel Sanctum):**
    - **أولاً: لتطبيق الويب الرئيسي (Inertia.js + React):**
        - اعتماد **Stateful Cookie/Session Authentication** (عبر Laravel Sanctum Web Guard).
        - **السبب:** يوفر أعلى معايير الحماية (HTTP-Only Cookies + SameSite Protection + Automatic CSRF Tokens) ويعمل بسلاسة مطلقة مع Inertia.js دون الحاجة لتخزين Tokens في الـ LocalStorage المعرضة للـ XSS.
    - **ثانياً: للـ APIs الخارجية وتطبيقات الموبايل (`routes/api.php`):**
        - اعتماد **Stateless Bearer Tokens** (Laravel Sanctum Personal Access Tokens).
        - يشتمل الـ Token على `tenant_id` والصلاحيات الممنوحة للطرف الخارجي، مع دعم تاريخ الانتهاء (Expiration) والـ Revocation.

2. **نظام الصلاحيات المباشرة (Permission-Centric Authorization):**
    - النواة الأساسية للتحكم في الوصول هي **الصلاحية الدقيقة (Atomic Permission)** (مثل: `expenses.approve`, `inventory.products.view`).
    - إسناد الصلاحية **للمستخدم مباشرة (Direct User Permissions)** بصرف النظر عن مسمساه الوظيفي.
    - توفير "قوالب أدوار" (Role Templates) اختيارية فقط لتسهيل الإسناد الجماعي.

3. **تأجيل البوابات الخارجية:**
    - استبعاد بوابات العملاء والموردين الخارجية من نطاق الـ MVP وتأجيلها للمراحل القادمة.

---

## ADR-004: نطاق الإصدار التجريبي الأول ورخطة الطريق (MVP Scope & Sprint Roadmap)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 4.1. القرار المصادق عليه (Final Decision & Scope)

1. **تطبيق الأعمال الأول للتحقق (First Validation Module):**
    - اعتماد **موديول إدارة المصروفات المصغر (Expenses Management Module)** ليكون أول موديول يُبنى كلياً فوق النواة.
2. **خطة السبرنتات (Sprint Roadmap):**
    - **Sprint 1:** بناء النواة المشتركة (Platform Core) + PostgreSQL Multi-Tenancy Auto Provisioning + Dual Auth & Permission Engine + Core Inertia React Shell + 🧪 Test 1.
    - **Sprint 2:** بناء موديول المصروفات (Expenses Module) + 🚀 Test 2 (تجربة حية للبرودكت أونر والتستر).

---

## ADR-005: المظهر ثنائي الوضعية، الأدوار الهجينة، والتوستس (Theme Toggle, Hybrid Roles & Toasts)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 5.1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى توثيق وحسم ثلاثة قرارات معمارية وتصميمية عاجلة بناءً على التوجيهات الأخيرة للـ Product Owner:

1. دعم التبديل السلس بين المظهر الفاتح والداكن (Light & Dark Theme Toggle).
2. إدراج وتجسيد نظام "الأدوار الهجينة" (Hybrid Role Templates) بوضوح إلى جانب الصلاحيات الفردية المباشرة.
3. توحيد ظهور رسائل التنبيهات والإشعارات (Toasts Notifications) في الزاوية العلوية المقابلة للشريط الجانبي (Top-Left Toast Notifications in RTL).

---

### 5.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **دعم المظهر ثنائي الوضعية (Light / Dark Theme Support):**
    - توفير مفتاح تبديل في شريط الرأس (`PlatformLayout.jsx`) يتيح التبديل الفوري بين المظهر الداكن (Dark Slate) والمظهر الفاتح (Clean Light Slate).
    - حفظ التفضيل تلقائياً في الـ `localStorage` والـ DOM `class="dark"`.

2. **نظام الأدوار الهجينة (Hybrid Roles & Direct Permissions System):**
    - **قوالب الأدوار (Role Templates):** إضافة جدول `roles` وجدول `role_permissions` في قاعدة بيانات المستأجر، حيث يحتوي كل دور (مثل: "مدير نظام", "محاسب", "مدير مخزن") على حزمة صلاحيات افتراضية مسبقة.
    - **المرونة الفردية (Individual Overrides):** تتيح شاشة إدارة الموظفين اختيار "دور وظيفي" للمستخدم مع بقاء القدرة الكاملة للأدمن على تعديل وإضافة/إلغاء أية صلاحية سريعة صريحة للموظف كـ Direct Permission.

3. **رسائل التنبيهات والـ Toasts (Toast Notification System):**
    - استبدال التنبيهات المباشرة بنظام **Toast Notifications** تفاعلي، يظهر في الزاوية العلوية اليسرى (`top-4 left-4`) وهي الجهة المقابلة للشريط الجانبي الأيمن في التنسيق العربي (RTL).
    - توفير درجات التنبيه الأربعة: النجاح (Success - Emerald)، الخطأ (Error - Red)، التحذير (Warning - Amber)، والمعلومات (Info - Blue) مع مؤقت اختفاء آلي وزر إغلاق سريع.

---

## ADR-006: حوكمة السلطة المعمارية وتوزيع المسؤوليات (Agent Authority & Architectural Governance)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 6.1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى حسم وتحديد حدود السلطات بين **صاحب المنتج والقيادة التقنية (Product Owner / Lead Developer)** و**وكيل التنفيذ الآلي (Antigravity Implementation Agent)** لتجنب أي تغييرات معمارية غير مصرح بها أو اجتهادات فردية في القرارات التأسيسية للمشروع.

---

### 6.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **تحديد المسؤوليات والـ Role Boundary:**
    - **Antigravity Implementation Agent:** مسكول حصراً عن **التنفيذ والتطوير والتأكد من الجودة وإجراء الاختبارات المؤتمتة (Implementation, Testing, Verification & Code Quality)** وفقاً للمواصفات والقرارات المعمارية المعتمدة.
    - **Product Owner / Lead Developer:** هو الجهة الوحيدة المبتة والمخولة بإصدار، تعديل، أو اعتماد القرارات المعمارية (`Architecture Decision Records - ADR`).
2. **التدرج الهرمي للسلطة (Authority Hierarchy):**
    1. سجل القرارات المعمارية المعتمدة (`ARCHITECTURE_DECISIONS.md`).
    2. وثيقة المعمارية الرئيسية (`architecture.md`).
    3. عقد المواصفات وقبول السبرنت (`SPRINT1_ACCEPTANCE_CONTRACT.md`).
    4. المعايير والعقود البرمجية في الكود القائم.
    5. تفاصيل التنفيذ الاختيارية التي يحددها Antigravity.
3. **حظر التعديل الضمني (No Silent Architecture Override):**
    - يُحظر على Antigravity إعادة تفسير أو تجاوز أي قرار معماري معتمد.
    - في حال وجود أي تعارض أو فجوة توثيقية (`Specification Gap`)، يجب على Antigravity:
        - التوقف عن تنفيذ الجزئية المتعارة.
        - التبليغ الفوري وشرح التعارض.
        - تقديم الخيارات والتوصيات.
        - الانتظار لحين صدور قرار صريح من Product Owner / Lead Developer.

---

## ADR-007: دورة حياة المستأجر وتجهيزه (Tenant Lifecycle & Provisioning)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 7.1. السياق والمشكلة (Context & Problem Statement)

تعتمد المنصة على نموذج **Database Per Tenant**، وبالتالي فإن إنشاء المستأجر (`Tenant`) لا يقتصر على إضافة سجل في قاعدة البيانات المركزية (`Landlord Database`)، بل يتطلب إنشاء وتجهيز بيئة مستقلة وقابلة للاستخدام بالكامل.

كما أن عملية التجهيز (`Provisioning`) تتضمن عمليات متعددة تشمل قاعدة البيانات المركزية، وإنشاء قاعدة بيانات المستأجر، وتشغيل الـ Migrations، وتجهيز الصلاحيات والمستخدم الإداري الأول.

لذلك نحتاج إلى تثبيت دورة حياة واضحة ومحددة لإنشاء المستأجر، وضمان عدم اعتبار المستأجر جاهزاً للاستخدام قبل اكتمال جميع مراحل التجهيز المطلوبة.

### 7.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **اعتماد دورة حياة موحدة لإنشاء وتجهيز المستأجر (Tenant Provisioning Lifecycle):**
    - إنشاء سجل المستأجر في قاعدة البيانات المركزية (`Landlord Database`).
    - إنشاء وربط النطاق (`Domain Mapping`).
    - إنشاء قاعدة البيانات المستقلة الخاصة بالمستأجر (`Tenant Database`).
    - تشغيل الـ Tenant Migrations.
    - تهيئة الصلاحيات الأساسية (`Base Permissions`).
    - إنشاء المستخدم الإداري الأول (`Initial Administrator`).
    - اعتبار المستأجر جاهزاً للاستخدام (`Tenant Ready`) بعد نجاح جميع المراحل السابقة.

2. **مركزية عملية الـ Provisioning:**
    - يجب أن تتم جميع مراحل تجهيز المستأجر من خلال خدمة الـ Provisioning المعتمدة في المنصة (`TenantProvisioningService`).
    - يُحظر إنشاء أو تجهيز Tenant Database يدوياً كجزء من دورة الاستخدام الطبيعية للمنصة.

3. **التعامل مع فشل الـ Provisioning:**
    - لا تعتبر عملية إنشاء المستأجر ناجحة إذا فشلت أي مرحلة أساسية من مراحل التجهيز.
    - يجب عدم إظهار حالة نجاح للمستخدم عند وجود Tenant غير مكتمل التجهيز.
    - يجب على النظام محاولة تنظيف الموارد التي تم إنشاؤها أثناء العملية الفاشلة (`Compensation / Cleanup`) كلما كان ذلك ممكناً وآمناً.
    - لا تعتبر `DB Transaction` على قاعدة البيانات المركزية وحدها ضماناً للـ Atomicity عبر إنشاء قاعدة بيانات المستأجر وتشغيل الـ Migrations.

4. **حالة المستأجر (Tenant State):**
    - وجود سجل Tenant في قاعدة البيانات المركزية لا يعني بالضرورة أن المستأجر أصبح جاهزاً للاستخدام.
    - يجب أن تكون حالة `Tenant Ready` مرتبطة باكتمال عملية الـ Provisioning بنجاح.

---

## ADR-008: حالة المنصة الصفرية والتسجيل الأول (Zero-State Platform & First Tenant Onboarding)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 8.1. السياق والمشكلة (Context & Problem Statement)

تحتاج AQL Platform إلى أن تكون قابلة للتشغيل والاستخدام من تثبيت نظيف دون الحاجة إلى إنشاء مستأجر أو مستخدم إداري مسبقاً من خلال قاعدة البيانات.

في حالة التثبيت الجديدة قد تكون قاعدة البيانات المركزية (`Landlord Database`) خالية تماماً من المستأجرين، وبالتالي لا يوجد `Tenant Context` يمكن استخدامه لإتمام عملية المصادقة التقليدية.

استخدام بيانات تجريبية (`Demo Data`) أو إنشاء Tenant افتراضي من خلال Seeder قد يخفي دورة التسجيل الحقيقية ولا يختبر قدرة المنصة على إنشاء أول مستأجر فعلياً.

### 8.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **اعتماد حالة المنصة الصفرية (Zero-Tenant State):**
    - يجب أن تدعم المنصة حالة عدم وجود أي مستأجرين (`Tenants = 0`) كحالة تشغيل صحيحة ومقبولة.
    - لا يجوز اعتبار وجود Tenant تجريبي شرطاً لتشغيل المنصة أو اختبارها.

2. **اعتماد التسجيل الأول من خلال الواجهة (First Tenant Onboarding):**
    - عند عدم وجود أي Tenant، يجب توفير واجهة عامة (`Public Onboarding`) لإنشاء أول مستأجر.
    - يجب أن يتم إنشاء أول Tenant من خلال نفس دورة الـ Provisioning الحقيقية المعتمدة للمنصة.

3. **حظر بيانات العرض والتدخل اليدوي:**
    - يُحظر الاعتماد على `Demo Tenant` أو `Demo Administrator` لإكمال دورة التشغيل.
    - لا يجوز أن تتطلب عملية إنشاء أول Tenant تدخلاً يدوياً في قاعدة البيانات.
    - لا يجوز إنشاء أول Tenant من خلال منطق خاص ببيئة التطوير فقط.

4. **إنشاء المسؤول الإداري الأول (Initial Administrator):**
    - المستخدم الذي يقوم بإنشاء المؤسسة من خلال الـ Onboarding يصبح المستخدم الإداري الأول للمستأجر، وفق نموذج الصلاحيات المعتمد.
    - يتم إنشاء هذا المستخدم ضمن عملية Provisioning الخاصة بالمستأجر.

5. **الانتقال بعد نجاح التسجيل (Post-Onboarding Transition):**
    - بعد نجاح عملية إنشاء وتجهيز المستأجر، يتم إنشاء جلسة مصادقة للمستخدم الإداري الأول.
    - ينتقل المستخدم مباشرة إلى بيئة المستأجر (`Tenant Platform Shell`) دون الحاجة إلى تدخل يدوي إضافي.

## ADR-009: تحديد سياق المستأجر وعزل البيانات (Deterministic Tenant Resolution & Data Isolation)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-15
- **المحررين:** Product Owner & Lead Developer

### 9.1. السياق والمشكلة (Context & Problem Statement)

في بيئة متعددة المستأجرين، يجب تحديد المستأجر الذي ينتمي إليه كل Request قبل تنفيذ أي عملية تعتمد على بيانات المستأجر.

وقد يؤدي وجود أكثر من Tenant إلى خطورة كبيرة إذا قام النظام باختيار Tenant بشكل تلقائي عند غياب `Tenant Context`، مثل اختيار أول Tenant نشط في قاعدة البيانات.

هذا السلوك يجعل اختيار المؤسسة مرتبطاً بترتيب البيانات بدلاً من هوية المستخدم أو السياق المحدد للطلب، وقد يؤدي إلى الوصول غير المقصود إلى بيانات مؤسسة أخرى.

لذلك يجب تثبيت آلية حتمية وآمنة لتحديد Tenant Context، مع اعتبار عزل بيانات المستأجرين حدًا أمنياً أساسياً في المنصة.

### 9.2. القرار النهائي المصادق عليه (Final Decision & Approval)

1. **اعتماد تحديد Tenant Context بشكل حتمي (Deterministic Tenant Resolution):**
    - يجب أن يتم تحديد `Tenant Context` من خلال آلية صريحة ومعتمدة.
    - لا يجوز للنظام اختيار Tenant عشوائياً أو ضمنياً عند عدم توفر السياق.

2. **حظر اختيار أول Tenant تلقائياً:**
    - يُحظر استخدام أول Tenant نشط (`First Active Tenant`) كـ fallback عند غياب Tenant Context.
    - لا يجوز أن يعتمد النظام على ترتيب سجلات قاعدة البيانات لتحديد المؤسسة الحالية.

3. **منع تنفيذ عمليات Tenant بدون سياق صالح:**
    - إذا تعذر تحديد Tenant Context، يجب ألا يتم تنفيذ أي عملية تعتمد على بيانات Tenant.
    - يجب توجيه الطلب إلى التدفق المناسب، مثل تسجيل الدخول أو التسجيل الأول أو اختيار Tenant بشكل صريح، حسب حالة المستخدم.

4. **عزل بيانات المستأجرين (Tenant Data Isolation):**
    - يجب أن تظل بيانات كل Tenant معزولة بالكامل عن Tenants الآخرين.
    - لا يجوز للمستخدم الوصول إلى بيانات Tenant آخر من خلال تعديل:
        - URL
        - Route Parameters
        - Request Parameters
        - Session Values
        - Tenant Identifiers
        - Client-Side State

5. **فرض العزل على الخادم (Server-Side Enforcement):**
    - يجب فرض Tenant Isolation على مستوى الـ Backend.
    - لا يجوز الاعتماد على إخفاء البيانات أو عناصر الواجهة فقط لضمان العزل.

6. **ارتباط Tenant Context بالمصادقة:**
    - بعد نجاح المصادقة، يجب أن يكون Tenant Context الخاص بالطلب مرتبطاً بالمستأجر المصرح للمستخدم بالوصول إليه.
    - لا يجوز أن تؤدي بيانات يرسلها العميل وحدها إلى تجاوز Tenant Context الذي تم تحديده من قبل المنصة.

## ADR-010: حدود إدارة المنصة وعزل هوية المستخدمين (Platform Administration Boundary & Identity Isolation)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-17
- **المحررين:** Product Owner & Lead Developer

### 10.1. السياق والمشكلة (Context & Problem Statement)

تحتاج AQL Platform إلى فصل واضح بين إدارة المنصة المركزية وبين منصات المستأجرين.

كما يجب الفصل الكامل بين مستخدمي المنصة (Platform Users) ومستخدمي المستأجرين (Tenant Users)، بحيث لا يؤدي امتلاك صلاحيات إدارية على المنصة إلى الوصول إلى بيانات الأعمال الخاصة بالمستأجرين.

### 10.2. القرار النهائي المصادق عليه (Final Decision)

1. اعتماد Platform Administration كـ Context مستقل عن Tenant Platform.

2. اعتماد هوية مستقلة لمستخدمي المنصة (Platform Users) عن مستخدمي المستأجرين (Tenant Users).

3. لا يستطيع Tenant User الدخول إلى Platform Administration.

4. لا يمتلك Platform User وصولًا مباشرًا إلى Tenant Business Data.

5. يتم إنشاء أول Platform Super Admin بواسطة النظام أثناء إعداد المنصة.

6. يقوم Platform Super Admin بإنشاء وإدارة بقية Platform Users.

7. تعتمد صلاحيات Platform Users على Permission-Centric Authorization.

8. تستخدم Roles كقوالب لإدارة مجموعات الصلاحيات، ولا تعتبر Role بديلًا عن Permission.

### 10.3. الأثر المعماري (Architectural Consequences)

- يصبح Platform Identity منفصلًا عن Tenant Identity.
- تصبح Platform Administration مسؤولة عن إدارة المنصة وليس عن Business Operations الخاصة بالمستأجرين.
- يجب أن تكون عمليات Platform Administration قابلة للتدقيق من خلال Platform Audit.

## ADR-011: الموديولات كتطبيقات مستقلة قابلة للتركيب (Platform Modules as Independent Applications)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-17
- **المحررين:** Product Owner & Lead Developer

### 11.1. السياق والمشكلة (Context & Problem Statement)

AQL Platform ليست Business Application واحدة، وإنما منصة يمكن تركيب تطبيقات أعمال مستقلة عليها.

لذلك يجب تحديد العلاقة بين المنصة والموديولات لضمان إمكانية نمو المنصة وإضافة تطبيقات جديدة دون تحويل النواة إلى مجموعة من Business Features المترابطة بشكل مباشر.

### 11.2. القرار النهائي المصادق عليه (Final Decision)

1. كل Business Application يتم تقديمه على AQL Platform باعتباره Platform Module مستقلًا.

2. يمكن تركيب Module على AQL Platform وإتاحته للمستأجرين وفق اشتراكاتهم.

3. كل Module مستقل وظيفيًا ويمتلك Business Logic الخاص به.

4. كل Module يستخدم Core Platform Services عند الحاجة.

5. لا يعتمد Module على الوصول المباشر إلى بيانات Module آخر.

6. يمكن للموديولات التكامل مع بعضها من خلال API Contracts.

7. يجب أن تبقى حدود الموديولات واضحة حتى مع وجود تكامل بينها.

### 11.3. الأثر المعماري

- يمكن إضافة Modules جديدة دون إعادة تصميم Core Platform.
- يمكن تطوير Modules بشكل مستقل.
- يتم الحفاظ على استقلالية Business Boundaries.
- يصبح Module Integration Contract جزءًا من التطور المستقبلي للمنصة.

## ADR-012: تكامل الموديولات من خلال عقود API (Module Integration Through API Contracts)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-17
- **المحررين:** Product Owner & Lead Developer

### 12.1. السياق والمشكلة

تحتاج الموديولات إلى تبادل البيانات والخدمات فيما بينها.

السماح للموديولات بالوصول المباشر إلى قواعد بيانات بعضها يؤدي إلى تقليل الاستقلالية وزيادة الترابط وصعوبة التطوير المستقبلي.

### 12.2. القرار النهائي

1. يتم التكامل بين الموديولات من خلال API Contracts.

2. لا يسمح Module بالوصول المباشر إلى Database الخاصة بـ Module آخر.

3. مالك Module هو المسؤول عن تعريف التكاملات التي يقدمها Module الخاص به.

4. التكاملات تكون معرفة مسبقًا ضمن Contract واضح.

5. في الإصدار الأول، إذا كان Tenant مشتركًا في الموديولات المطلوبة، يكون التكامل المقدم بينهما متاحًا مبدئيًا وفق الـ Contract.

6. سيتم دعم نموذج أكثر تقدمًا مستقبلًا يسمح بتقييد بعض Integration Features حسب Plan أو Entitlement.

7. لا يتم تنفيذ Integration Governance المتقدم ضمن المرحلة الحالية، وإنما يجب تصميم الـ Architecture بحيث تسمح بإضافته مستقبلًا.

### 12.3. مثال

يمكن لـ CRM تقديم API Contract يسمح لـ Accounting بالحصول على بيانات العميل.

وفي إصدار متقدم يمكن أن يكون:

قراءة بيانات العميل → متاحة للمشتركين في الموديولين.

بينما:

إنشاء قيد محاسبي تلقائي عند إتمام عملية بيع → قد يكون متاحًا فقط لخطة Enterprise مستقبلًا.

### 12.4. الأثر المعماري

- يمنع Database Coupling بين الموديولات.
- يحافظ على استقلالية كل Module.
- يسمح بتطوير Integration Governance وEntitlements مستقبلًا.

## ADR-013: دورة حياة تسجيل المستأجر وتجهيزه (Tenant Registration & Lifecycle)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 13.1. السياق والمشكلة (Context & Problem Statement)

تسجيل المستأجر ليس عملية إنشاء Tenant مكتمل وجاهز للعمل مباشرة.

تحتاج المنصة إلى دورة حياة واضحة تفصل بين:

- تقديم طلب التسجيل (Registration Request).
- اعتماد الطلب من إدارة المنصة (Approval).
- إنشاء هوية المستأجر وحجز اسمه ونطاقه (Tenant & Subdomain).
- تفعيل الطلب بواسطة صاحب التسجيل (Activation).
- استكمال البيانات المطلوبة (Data Collection).
- تجهيز البيئة التشغيلية المستقلة للمستأجر (Provisioning).
- انتقال المستأجر إلى الحالة التشغيلية Active.

الهدف هو عدم إنشاء قاعدة بيانات المستأجر أو تجهيز بيئته التشغيلية قبل أن يستكمل صاحب الطلب عملية التفعيل والبيانات المطلوبة.

---

### 13.2. القرار النهائي (Final Decision)

تعتمد المنصة دورة التسجيل والتجهيز التالية:

Registration
→ Approval
→ Activation
→ Data Collection
→ Provisioning
→ Active Tenant

مع تحديد مسؤوليات كل مرحلة بشكل صريح.

---

### 13.3. Registration

يقوم المستخدم بتقديم طلب تسجيل أولي من خلال Public Onboarding.

يمكن أن يتضمن الطلب، بحسب متطلبات المنصة:

- Email
- Phone
- Unique Name / Requested Slug
- Company Name
- وأي بيانات أولية أخرى تعتمدها المنصة.

في هذه المرحلة:

- يتم إنشاء `RegistrationRequest`.
- تكون حالة الطلب `pending`.
- لا يتم إنشاء Tenant Database.
- لا يتم إنشاء Initial Tenant Admin.
- لا يعتبر مقدم الطلب Tenant Active.

---

### 13.4. Approval

يقوم Platform User الذي يمتلك صلاحية الاعتماد بمراجعة Registration Request واتخاذ قرار الاعتماد.

عند اعتماد الطلب:

1. تتحول حالة Registration Request إلى `approved`.
2. يتم إنشاء Tenant Record في الـ Landlord Database.
3. يتم حجز/إنشاء الاسم الفريد للمستأجر.
4. يتم إنشاء/ربط Subdomain الخاص بالمستأجر.
5. يتم إنشاء Activation Token.
6. يتم إرسال Activation Link إلى مقدم الطلب.

في هذه المرحلة:

- يكون Tenant موجودًا في الـ Landlord Database.
- يكون Tenant غير Active.
- لا يتم إنشاء Tenant Database التشغيلية.
- لا يتم تشغيل Tenant Migrations.
- لا يتم إنشاء Initial Tenant Admin.
- لا يعتبر Tenant جاهزًا للاستخدام.

---

### 13.5. Activation

يستخدم مقدم الطلب Activation Link المرسل إليه للوصول إلى عملية تفعيل المستأجر.

يتم التحقق من Activation Token وصلاحيته وحالته قبل السماح باستكمال العملية.

Activation لا تعني أن Tenant أصبح Active.

بل تنقل الطلب إلى مرحلة Data Collection اللازمة قبل Provisioning.

---

### 13.6. Data Collection

يستكمل مقدم الطلب البيانات المطلوبة لإنشاء بيئة المستأجر، بما في ذلك بيانات Initial Tenant Admin مثل كلمة المرور، وأي بيانات أخرى تحددها المنصة.

لا يبدأ Provisioning قبل اكتمال البيانات والمتطلبات الإلزامية.

---

### 13.7. Provisioning

يبدأ Provisioning فقط بعد نجاح Activation واكتمال Data Collection.

يكون نطاق Provisioning هو تجهيز البيئة التشغيلية المستقلة للمستأجر، ويشمل:

1. إنشاء Tenant Database.
2. تشغيل Tenant Migrations.
3. إنشاء Base Data المطلوبة لتشغيل البيئة.
4. إنشاء Initial Tenant Admin.
5. تجهيز البيئة اللازمة لبدء تشغيل Tenant.

نجاح Provisioning هو الشرط الأساسي للانتقال إلى الحالة التشغيلية `Active`.

---

### 13.8. Active Tenant

بعد نجاح جميع عمليات Provisioning المطلوبة:

- يصبح Tenant في الحالة `Active`.
- تصبح Tenant Database جاهزة للاستخدام.
- يصبح Initial Tenant Admin قادرًا على تسجيل الدخول.
- يمكن للمستخدم متابعة العمل داخل Tenant Context.

### 13.9. Lifecycle Model

Registration Request
↓
Approval
│
├── Create Tenant
├── Create/Reserve Subdomain
└── Send Activation Link
↓
Activation
↓
Data Collection
↓
Provisioning
│
├── Database
├── Migrations
├── Base Data
└── Initial Admin
↓
Active Tenant

### 13.10. Architectural Boundaries

- RegistrationRequest هو كيان مستقل عن Tenant Provisioning.
- Approval يؤدي إلى إنشاء Tenant Identity وSubdomain، لكنه لا يؤدي إلى إنشاء Tenant Database.
- Tenant يمكن أن يكون موجودًا في الـ Landlord Database دون أن يكون Active.
- Activation وData Collection تسبقان Provisioning.
- TenantProvisioningService مسؤول عن تجهيز البيئة التشغيلية المستقلة للمستأجر، وليس عن Registration أو Approval.
- لا يعتبر Tenant Active قبل نجاح Provisioning.
- Public Onboarding منفصل معماريًا عن Platform Administration، مع إمكانية قيام Platform Administration بتنفيذ Approval.
- فشل Provisioning لا يجوز أن ينتج عنه Tenant Active غير مكتمل.
- أي Rollback أو Compensation لعملية Provisioning يجب أن يعيد النظام إلى حالة متسقة وفق سياسة Provisioning المعتمدة.

### 13.11. الأثر المعماري (Consequences)

**هذا القرار يحقق:**

- فصل Registration عن Tenant Provisioning.
- فصل Approval عن Provisioning.
- منع إنشاء قواعد بيانات للمستأجرين قبل اكتمال متطلبات التفعيل.
- تمكين إدارة المنصة من التحكم في قبول الطلبات قبل تخصيص البيئة التشغيلية.
- الحفاظ على استقلالية Tenant Database.
- جعل Tenant Lifecycle واضحًا وقابلًا للاختبار مرحلة بمرحلة.

## ADR-014: حالات التشغيل وسياسات الموديولات (Tenant Operational States & Module Policies)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-17
- **المحررين:** Product Owner & Lead Developer

### 14.1. السياق والمشكلة

حالة Tenant التشغيلية لا تعني بالضرورة منع المستخدم من تسجيل الدخول.

خصوصًا في حالة Suspended، قد تحتاج بعض التطبيقات إلى السماح بعمليات محدودة بدلًا من إيقاف الاستخدام بالكامل.

### 14.2. القرار النهائي

1. Tenant Operational State منفصل عن Authentication State.

2. حالة Suspended لا تعني منع تسجيل الدخول بالضرورة.

3. أثناء Suspended يدخل Tenant في وضع تشغيل محدود.

4. العمليات المسموح بها أثناء Suspended يتم تحديدها بواسطة سياسات التطبيق/الموديول (Application/Module Policies).

5. لا يتم تعريف Business Operations الخاصة بكل Module داخل Core Platform.

6. حالة Archived تعني الاحتفاظ بالبيانات وعدم حذفها تلقائيًا.

7. حذف البيانات بعد Archive قرار مستقل يخضع مستقبلًا لسياسات الاحتفاظ والشروط المعتمدة.

### 14.3. الأثر

- يسمح لكل Module بتحديد السلوك المناسب لحالات التشغيل المختلفة.
- يمنع Core Platform من معرفة تفاصيل Business Logic الخاصة بالموديولات.
- يتيح إضافة حالات وخطط تشغيل أكثر تقدمًا مستقبلًا.

---

## ADR-015: فصل تركيب الموديول عن تمكينه للمستأجر (Module Installation vs Tenant Enablement)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 15.1. السياق والمشكلة

الموديول تطبيق أعمال مستقل يمكن تركيبه على المنصة، لكن وجوده على المنصة لا يعني أن كل Tenant يستخدمه. يجب الفصل بين توفر الموديول على مستوى المنصة وبين اشتراك المستأجر وتجهيز بيئته.

### 15.2. القرار النهائي

1. تعتمد المنصة مرحلتين مستقلتين:
    - **Platform Module Installation:** تسجيل الموديول والتحقق من التوافق وتجهيزه ليصبح متاحًا على المنصة.
    - **Tenant Module Provisioning / Enablement:** تجهيز الموديول داخل بيئة Tenant بعد اشتراكه فيه.
2. وجود Module Installed لا يعني أن Module Active لكل Tenant.
3. Tenant Subscription هو الشرط الذي يحدد إتاحة الموديول للمستأجر.
4. تفاصيل آلية التثبيت التقنية تؤجل إلى قرار وتنفيذ لاحقين.

### 15.3. الأثر

يمنع هذا الفصل خلط Lifecycle الخاص بالمنصة مع Lifecycle الخاص بالمستأجر، ويتيح نمو عدد الموديولات والمستأجرين دون ربطهما بعملية واحدة.

---

## ADR-016: ملكية نطاق وبيانات الموديول (Module Domain & Data Ownership)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 16.1. القرار النهائي

1. كل Module يمتلك Business Domain وBusiness Logic الخاصين به.
2. كل Module يمتلك بيانات الـ Business Domain الخاصة به داخل Tenant Context.
3. الموديول يمكنه استخدام خدمات وبيانات مشتركة توفرها Core Platform Services وفق العقود العامة.
4. لا يجوز لموديول الوصول مباشرة إلى جداول أو قاعدة بيانات أو Internal Business Logic لموديول آخر.
5. تفاصيل تخزين بعض إعدادات الموديول (بنية مشتركة أو خاصة) ليست قرارًا معماريًا نهائيًا في هذه المرحلة.

### 16.2. الأثر

يحافظ القرار على استقلالية Business Boundaries مع السماح للموديولات بالاستفادة من قدرات المنصة دون إعادة بناءها.

---

## ADR-017: عقد تعريف الموديول للمنصة (Module Metadata / Manifest Contract)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 17.1. القرار النهائي

1. يجب أن يقدم كل Module بيانات تعريفية قابلة للقراءة بواسطة المنصة عند تركيبه.
2. تمثل هذه البيانات هوية الموديول وإصداره وقدراته ومتطلباته واعتمادياته ومعلومات التكامل ذات الصلة.
3. تستخدم المنصة هذه البيانات للتحقق من التوافق وتسجيل الموديول وفهم قدراته.
4. الشكل النهائي لـ Manifest/Metadata Schema يؤجل إلى تصميم لاحق.
5. الـ Manifest لا يحتوي Business Logic ولا يحول Module Registry إلى مخزن للمنطق التجاري.

---

## ADR-018: تسلسل الوصول: Subscription وEntitlement وPermission

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 18.1. القرار النهائي

1. **Subscription** يحدد الموديولات التي يستطيع Tenant استخدامها.
2. **Entitlement / Plan** يحدد الميزات والقدرات المتاحة داخل الموديول وفق مستوى الاشتراك.
3. **Permission** تحدد السلطة الفعلية للمستخدم لتنفيذ العملية.
4. يجب التمييز معماريًا بين Module Access وFeature Access وUser Authority.
5. التسلسل المفاهيمي هو:
   `Tenant Subscription → Module Availability → Plan/Entitlement → Feature/Capability → User Permission → Allow/Deny`.
6. في الإصدار التجريبي الحالي لا توجد أسعار أو Billing/Payment Processing ضمن النطاق.

### 18.2. الأثر

يتيح القرار إضافة خطط وميزات متقدمة مستقبلًا دون تغيير مفهوم الموديول أو إعادة تعريف Permission model.

---

## ADR-019: نطاقات الإعدادات وخدمات المنصة العامة للموديولات (Configuration Scopes & Public Platform Services)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 19.1. القرار النهائي

1. توجد Configuration Scopes مستقلة مفاهيميًا:
    - Platform
    - Tenant
    - Module
2. كل Module يملك إعداداته الخاصة ويعمل داخل القواعد العامة التي تحددها المنصة.
3. قد يؤدي تركيب Module إلى إتاحة إعدادات جديدة في Tenant Platform لم تكن متاحة قبل تركيب الموديول.
4. الموديول يستخدم Core Platform Services العامة مثل Identity وTenancy وAuthorization وSubscription وConfiguration وAudit وNotifications وStorage.
5. تظل تفاصيل التخزين الفعلي لإعدادات الموديول قرار تنفيذ لاحق.
6. تشابه خدمة بين Platform Context وTenant Context لا يعني دمج الهوية أو السياق؛ يجب الحفاظ على الفصل بين البيئتين.

### 19.2. الأثر

يسمح القرار للموديولات بتوسيع قدرات Tenant Platform دون تحويل Core Platform إلى Business Application خاصة بموديول بعينه.

---

## ADR-020: مسؤولية التدقيق وعزل سياقات الخدمات (Platform Audit & Context Separation)

- **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
- **التاريخ:** 2026-09-18
- **المحررين:** Product Owner & Lead Developer

### 20.1. القرار النهائي

1. Audit Capability مسؤولية Core Platform.
2. كل Module يقدم بيانات العملية التجارية اللازمة لإتمام سجل التدقيق.
3. Platform Audit منفصل عن Tenant Audit.
4. كل أمر صادر من Platform Administration يخضع للتدقيق.
5. يجب الحفاظ على الفصل بين Platform Context وTenant Context في الخدمات المشتركة، حتى لو كانت الوظيفة العامة متشابهة.
6. Notification capability قد تستخدم آلية موحدة تقنيًا مستقبلًا، لكن إعدادات وسياق Platform Notifications منفصلان عن Tenant Notifications.
7. Event Bus مؤجل بالكامل إلى مرحلة لاحقة بعد اكتمال المنصة وإطلاقها.

### 20.2. الأثر

يحافظ القرار على استقلال السياقات ويمنع تسرب الصلاحيات أو البيانات بين Platform Administration وTenant Platform، مع إبقاء Core Services قابلة لإعادة الاستخدام.

---

## ملاحظة خط الأساس المعماري

بعد اعتماد C1 وC2 واستكمال C3.1 إلى C3.4، تعتبر الصورة المعمارية العليا الحالية **Architecture Baseline** للانتقال إلى التنفيذ. يتم توثيق C4 Level 4 (Code) أثناء التنفيذ بناءً على الكود الفعلي، ولا يتم اختراع تفاصيل Code-level architecture مسبقًا دون حاجة.

## ADR-021 — تحديد سياق طلب المستأجر (Tenant Request Resolution & Access Context)

**Status:** Accepted
**Date:** 2026-09-18

### Context — السياق (ADR-021)

يجب أن يتم تحديد **Tenant** الصحيح لكل Request قبل تنفيذ أي عملية مرتبطة بالمصادقة أو الاشتراك أو الـ Module أو الصلاحيات.

لا يجوز تحديد الـ Tenant عن طريق البحث داخل Tenant Databases عن User باستخدام Email أو أي بيانات خاصة بالمستخدم.

أما Requests القادمة إلى **Platform Domain** فلها مسار مستقل يعتمد على **Platform Identity** و **Landlord Database**، ولا تدخل ضمن Tenant Authentication.

### Decision — القرار (ADR-021)

بالنسبة لأي Request موجه إلى Tenant، يقوم الـ Platform أولًا بـ:

```text
Determine Tenant
        ↓
Determine Subscription
        ↓
Determine Requested Module / Availability
        ↓
Determine Tenant User
        ↓
Determine Authorization
        ↓
Continue / Redirect to Requested Resource
```

إذا كان الـ Resource **Public** ولا يتطلب Authentication أو Authorization، يتم تجاوز User وPermission checks وفقًا لسياسة الوصول الخاصة بالـ Resource.

الـ **Tenant User لا يحدد Tenant Context**.

بل العكس:

> **Tenant Context هو الذي يحدد Tenant User Store الذي سيتم البحث فيه.**

وفي حالة الحاجة إلى Authentication، يجب الاحتفاظ بالـ **Original Requested URI** حتى يتمكن المستخدم بعد نجاح المصادقة من الاستمرار إلى الـ Resource المطلوب، بدلًا من تحويله دائمًا إلى Tenant Dashboard.

أما Requests القادمة إلى Platform Domain فتستخدم **Platform Identity** و **Landlord Database** بشكل مستقل.

### Consequences — النتائج (ADR-021)

- يمكن أن يوجد نفس Email في أكثر من Tenant بشكل مشروع.
- يمنع Cross-Tenant User Discovery كوسيلة لتحديد Tenant.
- Tenant Authentication تتم فقط داخل Tenant Context المحدد.
- Platform Authentication وTenant Authentication يظلان Security Contexts منفصلين.
- يمكن للـ Public وProtected Resources اتباع مسارات مختلفة للمصادقة دون تكرار Tenant Resolution.

### Rejected Alternative — البديل المرفوض (ADR-021)

تحديد Tenant من خلال البحث في Tenant Databases عن User باستخدام Email.

**Reason:**
لأنه يخالف Tenant Isolation Boundary ويجعل User Identity مسؤولة عن تحديد Tenant Context.

---

## ADR-022 — ملكية الـ Module وحدود مسؤولية الـ Platform (Module Ownership & Platform Boundary)

**Status:** Accepted
**Date:** 2026-09-18

### Context — السياق (ADR-022)

كل **Platform Module** هو Business Application مستقل يتم Provisioning له على AQL Platform.

يجب أن يوفر الـ Platform البيئة والخدمات المشتركة اللازمة لتشغيل الـ Module، دون أن يستولي على Business Logic الخاص به أو يعيد تنفيذه.

### Decision — القرار (ADR-022)

كل Module مسؤول بالكامل عن الـ Business Domain الخاص به، بما في ذلك:

```text
Controllers
Models
Requests
Services
Policies
Migrations
Routes
UI
Business Logic
Business Data
Tests
...
```

ويظل الـ Module مالكًا للـ Business Logic والـ Business Data الخاصة به.

يقدم الـ Module إلى الـ Platform **Module Metadata / Manifest** الذي يحتوي على المعلومات اللازمة لتسجيله وإدارته وتكامله مع الـ Platform.

الـ Platform **لا يعيد تنفيذ Module Business Logic** ولا ينشئ نظام Authorization موازيًا يصف صلاحيات المستخدمين داخل كل Module.

### Authorization Boundary (ADR-022)

حماية الـ Module Routes وEndpoints مسؤولية الـ Module، ويمكن أن يستخدم لذلك:

- Middleware
- Roles
- Permissions
- Policies
- Gates
- أو أي Authorization mechanism معتمد.

أما الـ Platform فمسؤوليته هي تحديد:

> **هل هذا Module متاح لهذا Tenant؟**

وليس:

> **ماذا يستطيع هذا User أن يفعل داخل هذا Module؟**

### Consequences — النتائج (ADR-022)

- الـ Module مستقل في Business Logic وBusiness Data.
- الـ Module مسؤول عن Routes الخاصة به.
- الـ Module مسؤول عن Internal Authorization.
- الـ Platform لا يحتفظ بتفاصيل صلاحيات كل User داخل كل Route.
- الـ Platform مسؤول عن Module Availability وفق Tenant Subscription / Entitlement.

---

## ADR-023 — Module Provisioning وRollback (Module Provisioning & Rollback)

**Status:** Accepted
**Date:** 2026-09-18

### Context — السياق (ADR-023)

تركيب Module على AQL Platform يتطلب تنفيذ مجموعة من عمليات التسجيل والتهيئة، وقد يشمل ذلك أكثر من Resource أو أكثر من Storage Context.

لذلك لا يمكن افتراض أن كامل عملية Provisioning يمكن التعامل معها كـ **Single Database Transaction**.

### Decision — القرار (ADR-023)

يجب أن تتم عملية **Module Provisioning** من خلال Controlled Platform Process.

يقوم الـ Process بتركيب الـ Module وتسجيل الـ Metadata / Manifest الخاصة به وتنفيذ متطلبات الـ Integration والتهيئة اللازمة لتشغيله.

إذا فشلت عملية Provisioning قبل اكتمالها، يجب تنفيذ:

**Rollback / Compensation**.

بحيث تتم إعادة الـ Platform إلى آخر **Valid State** قبل بدء العملية.

الـ Rollback ليس بالضرورة Database Transaction واحدة، وإنما **Compensating Lifecycle Process** يحتوي على الإجراءات العكسية الممكنة لكل Provisioning Step.

### Provisioning Lifecycle (ADR-023)

```text
Module Package
      ↓
Validate Manifest
      ↓
Register Module
      ↓
Provision Module
      ↓
Register Metadata
      ↓
Complete Integration
      ↓
Module Ready
```

وفي حالة الفشل:

```text
Provisioning
      ↓
Failure
      ↓
Rollback / Compensation
      ↓
Previous Valid State
```

### Consequences — النتائج (ADR-023)

- لا يجب أن يترك فشل Provisioning الـ Platform في حالة غير معروفة.
- يجب أن يكون لكل Provisioning Step، حيثما أمكن، **Compensating Action**.
- يجب أن تكون حالة Provisioning قابلة للتتبع.
- Module Installation Governance مسؤولية Platform.

---

## ADR-024 — إخراج الـ Module من الـ Platform (Module Deprovisioning / Uninstallation)

**Status:** Accepted
**Date:** 2026-09-18

### Context — السياق (ADR-024)

هناك فرق جوهري بين:

1. فشل عملية Provisioning أثناء تركيب Module.
2. قرار إزالة Module تم تركيبه بالفعل وأصبح Installed.

لذلك لا يجوز استخدام Rollback كمصطلح للعملية الثانية.

### Decision — القرار (ADR-024)

يتم التعامل مع إزالة Module مثبت بالفعل باعتبارها عملية مستقلة تسمى:

**Module Deprovisioning / Uninstallation**.

ويكون الفصل كالتالي:

```text
Provisioning
    │
    └── Failure
          ↓
      Rollback / Compensation
```

بينما:

```text
Installed Module
       │
       └── Removal Request
               ↓
         Deprovisioning
```

ولا تعني عملية Deprovisioning تلقائيًا حذف الـ **Business Data** التي أنشأها الـ Module.

أي **Data Retention / Data Deletion Policy** يتم التعامل معها كقرار Lifecycle مستقل.

### Consequences — النتائج (ADR-024)

- **Rollback** يعالج فشل Provisioning.
- **Deprovisioning** يعالج الإزالة المقصودة لـ Module مثبت.
- إزالة Module لا تعني تلقائيًا حذف بياناته.
- قواعد Retention وDeletion تظل قرارًا معماريًا مستقلًا.
