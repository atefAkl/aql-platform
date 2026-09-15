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
| **ADR-006** | حوكمة السلطة المعمارية وتوزيع المسؤوليات (Agent Authority & Architectural Governance) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-007** | دورة حياة المستأجر وتجهيزه (Tenant Lifecycle & Provisioning) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-008** | حالة المنصة الصفرية والتسجيل الأول (Zero-State Platform & First Tenant Onboarding) | 🟢 معتمد (Accepted) | 2026-09-15 |
| **ADR-009** | تحديد سياق المستأجر وعزل البيانات (Deterministic Tenant Resolution & Data Isolation) | 🟢 معتمد (Accepted) | 2026-09-15 |


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

---

## ADR-006: حوكمة السلطة المعمارية وتوزيع المسؤوليات (Agent Authority & Architectural Governance)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

نحتاج إلى حسم وتحديد حدود السلطات بين **صاحب المنتج والقيادة التقنية (Product Owner / Lead Developer)** و**وكيل التنفيذ الآلي (Antigravity Implementation Agent)** لتجنب أي تغييرات معمارية غير مصرح بها أو اجتهادات فردية في القرارات التأسيسية للمشروع.

---

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

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
     * التوقف عن تنفيذ الجزئية المتعارة.
     * التبليغ الفوري وشرح التعارض.
     * تقديم الخيارات والتوصيات.
     * الانتظار لحين صدور قرار صريح من Product Owner / Lead Developer.

---

## ADR-007: دورة حياة المستأجر وتجهيزه (Tenant Lifecycle & Provisioning)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

تعتمد المنصة على نموذج **Database Per Tenant**، وبالتالي فإن إنشاء المستأجر (`Tenant`) لا يقتصر على إضافة سجل في قاعدة البيانات المركزية (`Landlord Database`)، بل يتطلب إنشاء وتجهيز بيئة مستقلة وقابلة للاستخدام بالكامل.

كما أن عملية التجهيز (`Provisioning`) تتضمن عمليات متعددة تشمل قاعدة البيانات المركزية، وإنشاء قاعدة بيانات المستأجر، وتشغيل الـ Migrations، وتجهيز الصلاحيات والمستخدم الإداري الأول.

لذلك نحتاج إلى تثبيت دورة حياة واضحة ومحددة لإنشاء المستأجر، وضمان عدم اعتبار المستأجر جاهزاً للاستخدام قبل اكتمال جميع مراحل التجهيز المطلوبة.

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

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

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

تحتاج AQL Platform إلى أن تكون قابلة للتشغيل والاستخدام من تثبيت نظيف دون الحاجة إلى إنشاء مستأجر أو مستخدم إداري مسبقاً من خلال قاعدة البيانات.

في حالة التثبيت الجديدة قد تكون قاعدة البيانات المركزية (`Landlord Database`) خالية تماماً من المستأجرين، وبالتالي لا يوجد `Tenant Context` يمكن استخدامه لإتمام عملية المصادقة التقليدية.

استخدام بيانات تجريبية (`Demo Data`) أو إنشاء Tenant افتراضي من خلال Seeder قد يخفي دورة التسجيل الحقيقية ولا يختبر قدرة المنصة على إنشاء أول مستأجر فعلياً.

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

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

---

## ADR-009: تحديد سياق المستأجر وعزل البيانات (Deterministic Tenant Resolution & Data Isolation)

* **الحالة:** 🟢 معتمد ومصادق عليه (Accepted / Approved)
* **التاريخ:** 2026-09-15
* **المحررين:** Product Owner & Lead Developer

### 1. السياق والمشكلة (Context & Problem Statement)

في بيئة متعددة المستأجرين، يجب تحديد المستأجر الذي ينتمي إليه كل Request قبل تنفيذ أي عملية تعتمد على بيانات المستأجر.

وقد يؤدي وجود أكثر من Tenant إلى خطورة كبيرة إذا قام النظام باختيار Tenant بشكل تلقائي عند غياب `Tenant Context`، مثل اختيار أول Tenant نشط في قاعدة البيانات.

هذا السلوك يجعل اختيار المؤسسة مرتبطاً بترتيب البيانات بدلاً من هوية المستخدم أو السياق المحدد للطلب، وقد يؤدي إلى الوصول غير المقصود إلى بيانات مؤسسة أخرى.

لذلك يجب تثبيت آلية حتمية وآمنة لتحديد Tenant Context، مع اعتبار عزل بيانات المستأجرين حدًا أمنياً أساسياً في المنصة.

### 2. القرار النهائي المصادق عليه (Final Decision & Approval)

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

