# AQL Platform --- عقد تنفيذ Sprint 3

**الحالة:** مسودة للمراجعة والاعتماد\
**Gate:** Gate 1 --- تطبيق القرارات المعمارية\
**التاريخ:** 2026-09-18\
**المستودع:** `atefAkl/aql-platform`\
**الفرع المستهدف:** `main`\
**المالك:** Product Owner / Lead Developer\
**وكيل التنفيذ:** Antigravity

> هذا العقد هو عقد تنفيذ وقبول خاص بـ Sprint 3. وهو يترجم القواعد
> المعتمدة في `PLATFORM_CONTRACT.md` إلى نطاق تنفيذ واختبارات واضحة لهذا
> الـ Sprint. ولا يضيف قرارًا معماريًا جديدًا من تلقاء نفسه.

------------------------------------------------------------------------

# 1. الغرض

يهدف Sprint 3 إلى تطبيق وتثبيت القرارات المعمارية الخاصة بحدود Platform
/ Tenant، وتحديد Tenant بصورة حتمية، وفصل هويات المنصة والمستأجر، ووضع
الأساس التشغيلي للوحدات المستقلة.

هذا الـ Sprint هو:

**Architecture Hardening & Platform Foundation Sprint**

وليس Sprint لبناء Business Module جديد.

الهدف هو نقل الكود الحالي من السلوك الجزئي المعتمد على Session وبعض
الحدود المختلطة إلى البنية المعتمدة، دون إدخال Features غير مرتبطة بنطاق
Sprint 3.

------------------------------------------------------------------------

# 2. المرجعية والسلطة

يجب أن يلتزم التنفيذ بالترتيب التالي:

1.  قرارات ADR المعتمدة.
2.  `architecture.md`.
3.  `PLATFORM_CONTRACT.md`.
4.  هذا Sprint Contract.
5.  معايير الهندسة المعتمدة.
6.  تفاصيل التنفيذ.

إذا ظهر تعارض بين التنفيذ وقرار معماري معتمد:

-   يتوقف Antigravity عن الجزء المتعارض.
-   يوثق التعارض.
-   يوضح أثره.
-   يقترح بدائل عند الحاجة.
-   ينتظر قرار Product Owner / Lead Developer.

**لا يجوز اتخاذ قرار معماري صامت داخل التنفيذ.**

------------------------------------------------------------------------

# 3. نطاق Sprint 3

يشمل Sprint 3:

1.  Deterministic Tenant Request Resolution
2.  الفصل بين Platform Identity وTenant Identity
3.  Tenant Operational Validation
4.  Subscription / Module Availability
5.  Module Metadata / Manifest
6.  Module Registry
7.  Module Provisioning
8.  Provisioning Rollback / Compensation
9.  Module Deprovisioning
10. تصحيح حدود Routes / Request Context
11. الاختبارات المعمارية والأمنية
12. Regression للوظائف المقبولة سابقًا

------------------------------------------------------------------------

# 4. ما هو خارج النطاق

لا يقوم Sprint 3 بتنفيذ:

-   Billing
-   Payment Processing
-   Commercial Pricing
-   Advanced Plan / Entitlement Governance
-   Event Bus
-   Microservices
-   API Gateway
-   Direct Database Access بين Modules
-   Arbitrary Impersonation
-   نظام Authorization تجاري أو بديل داخل Platform Core ليحل محل Module
    Authorization
-   Business Logic لـ Expenses / CRM / Inventory وغيرها داخل Platform
    Core
-   بوابات العملاء والموردين الخارجية
-   Production-grade Module Package Loader كامل إذا كان ذلك يحتاج إلى
    قرار أو تصميم مؤجل

يجوز تنفيذ الحد الأدنى اللازم لإثبات Module Lifecycle باستخدام Test /
Fixture Module.

------------------------------------------------------------------------

# 5. Workstream A --- تحديد المستأجر وسياق الطلب

## الهدف

كل Tenant Request يجب أن يدخل إلى Tenant Context الصحيح اعتمادًا على هوية
المستأجر التي يحددها الطلب.

## المتطلبات

1.  يتم تحديد Tenant من خلال Domain / Request Context وفق آلية Tenancy
    المعتمدة.
2.  لا يجوز اكتشاف Tenant من خلال البحث في قواعد بيانات المستأجرين عن
    Email.
3.  لا يجوز اعتبار Session Value المصدر الموثوق لتحديد Tenant.
4.  يجب أن تعمل Tenant Routes داخل Tenant Context.
5.  يجب أن تبقى Platform Routes خارج Tenant Context.
6.  النطاق غير المسجل أو غير الصحيح لا يجوز أن يؤدي إلى اختيار Tenant
    عشوائي.
7.  يجب الحفاظ على Tenant Isolation الحالي وعدم إدخال Regression.

## URI المطلوب

إذا وصل طلب محمي مثل:

``` text
/controller/action/{uuid}
```

وكانت المصادقة مطلوبة، فيجب الاحتفاظ بالـ URI المطلوب وإعادة المستخدم
إليه بعد نجاح المصادقة إذا كان مخولًا بذلك.

لا يجوز أن يكون Dashboard هو التحويل الإجباري بعد كل Login.

يكون Dashboard هو الوجهة الافتراضية فقط عندما لا يوجد Intended Resource
محدد.

------------------------------------------------------------------------

# 6. Workstream B --- الفصل بين هويات المنصة والمستأجر

## تدفق Platform

``` text
Platform Domain
      ↓
Platform Context
      ↓
Landlord DB
      ↓
Platform User
      ↓
Platform Authorization
      ↓
Platform Administration
```

## تدفق Tenant

``` text
Tenant Domain
      ↓
Tenant Context
      ↓
Tenant DB
      ↓
Tenant User
      ↓
Module Authorization
```

## المتطلبات

1.  وجود Platform Identity مستقل عن Tenant Identity.
2.  Platform Authentication يبحث فقط في Platform / Landlord Identity
    Store.
3.  Tenant Authentication يبحث فقط في Tenant DB الذي تم تحديده مسبقًا.
4.  يجوز أن يوجد نفس Email كمستخدم Platform أو في أكثر من Tenant.
5.  ممنوع Global Tenant Database Scan لاكتشاف User.
6.  لا يجوز أن يحصل Platform User من خلال Platform Administration على
    وصول مباشر إلى Tenant Business Data.
7.  لا يجوز لـ Tenant User الدخول إلى Platform Administration من خلال
    Tenant Authentication.

أما أسماء Laravel Guards / Providers فهي تفاصيل تنفيذية، بشرط أن تحقق
نفس الحدود الأمنية.

------------------------------------------------------------------------

# 7. Workstream C --- التحقق من طلب Tenant المحمي

بالنسبة إلى Protected Tenant Request، يجب فصل المسؤوليات التالية:

## Tenant Context

-   Tenant موجود.
-   Domain مرتبط بهذا Tenant.
-   Tenant في حالة تشغيلية تسمح بالطلب.

## Subscription / Module Availability

-   الاشتراك / التمكين يسمح باستخدام الـ Module المطلوبة.

## Tenant User

-   المستخدم موجود في Tenant DB المحدد.
-   المستخدم Active.
-   المستخدم Suspended / Inactive لا يستطيع تنفيذ العمليات المحمية.

## Authorization

-   Module Authorization تحدد ما إذا كان المستخدم يستطيع تنفيذ العملية.

لا يجوز دمج هذه المسؤوليات في Generic Check واحد يخفي حدودها.

------------------------------------------------------------------------

# 8. Workstream D --- إتاحة Modules للمستأجرين

## الهدف

يجب أن تستطيع المنصة تحديد ما إذا كانت Module معينة متاحة لـ Tenant
معين.

التدفق:

``` text
Tenant
  ↓
Subscription / Enablement
  ↓
Module Availability
  ↓
Module Runtime
```

وداخل الوحدة:

``` text
Authenticated User
  ↓
Module Authorization
  ↓
Operation
```

## المتطلبات

1.  Module Registration Metadata جزء من Platform Metadata.
2.  Tenant Subscription / Enablement Metadata جزء من Platform / Landlord
    Boundary.
3.  Module Business Data تبقى داخل Tenant Context.
4.  يجب أن تستطيع المنصة الإجابة عن:
    `Is Module X available for Tenant Y?`
5.  إذا كانت Module غير متاحة، يجب رفض الطلب قبل تنفيذ Business Logic
    الخاص بها.
6.  Public Resource الذي لا يحتاج Authentication أو Authorization لا
    يحتاج إلى User Permission Lookup.
7.  لا يجوز إنشاء Duplicate Per-Route User Permission Matrix داخل
    Platform.

يقتصر Sprint 3 على الحد الأدنى اللازم لإثبات Module Registration
وAvailability.

------------------------------------------------------------------------

# 9. Workstream E --- Module Metadata / Manifest

كل Module يجب أن توفر Metadata كافية لتسجيلها في Platform.

الحد الأدنى:

-   Module Key / Identifier
-   Name
-   Version
-   Capabilities / Features
-   Dependencies عند الحاجة
-   Installation / Provisioning Metadata
-   Lifecycle Status

يجب أن تظل Metadata منفصلة عن Business Logic.

لا يجوز نقل Business Rules الخاصة بـ Expenses مثلًا إلى Platform Core
لمجرد إثبات الـ Contract.

------------------------------------------------------------------------

# 10. Workstream F --- Module Registry

يجب توفير آلية Platform-level لتسجيل الوحدات ومعرفة حالتها.

الـ Registry مسؤول عن Platform Metadata الخاصة بالوحدة، وليس عن امتلاك
Business Data الخاصة بها.

يجب أن يسمح الحد الأدنى للمنصة بمعرفة:

-   هوية الوحدة.
-   إصدارها.
-   حالتها.
-   قدراتها الأساسية.
-   ارتباطاتها / Dependencies عند الحاجة.
-   بيانات Provisioning المطلوبة.
-   إتاحتها وفق قواعد Platform Subscription / Enablement.

لا يشترط Sprint 3 بناء Package Manager كامل.

------------------------------------------------------------------------

# 11. Workstream G --- Module Provisioning

يجب تنفيذ Lifecycle منضبط لـ Module Provisioning.

الحد الأدنى:

``` text
Validate Manifest
      ↓
Register Module
      ↓
Provision
      ↓
Complete Integration
      ↓
Ready
```

يجب أن تكون عملية Provisioning قابلة للتتبع باعتبارها Lifecycle
Operation.

ويجوز استخدام Test / Fixture Module لإثبات دورة الحياة.

## مبدأ الملكية

كل ما ينتمي إلى Module يجب أن يبقى مملوكًا لها من حيث Business Logic
وBusiness Data.

المنصة تنسق Lifecycle ولا تستولي على منطق الوحدة.

------------------------------------------------------------------------

# 12. Workstream H --- Rollback / Compensation

إذا فشل Module Provisioning قبل اكتماله:

``` text
Provisioning Failure
        ↓
Rollback / Compensation
        ↓
Previous Valid State
```

## المتطلبات

1.  تنظيف Partial Registration.
2.  إمكانية عكس Partial Metadata.
3.  إزالة Partial Resources حيث يكون ذلك ممكنًا.
4.  عدم ترك Module الفاشلة في حالة `Ready` أو `Installed` بصورة غير
    صحيحة.
5.  تنفيذ Rollback كعملية Compensation عندما لا يمكن تغطية جميع العمليات
    بواسطة Transaction واحدة.
6.  وجود اختبار آلي يثبت Rollback.

## تمييز مهم

Tenant Provisioning Compensation وModule Provisioning Rollback نمطان
مرتبطان، لكنهما Lifecycle Operations منفصلتان.

------------------------------------------------------------------------

# 13. Workstream I --- Module Deprovisioning

يجب تثبيت الفرق بين:

``` text
Failed Provisioning
        ↓
Rollback
```

و:

``` text
Installed Module
        ↓
Deprovisioning / Uninstallation
```

## المتطلبات

1.  Deprovisioning عملية Lifecycle صريحة.
2.  لا يحذف Deprovisioning Module Business Data تلقائيًا.
3.  يجب أن تكون حالة Module التي تمت إزالتها مختلفة عن حالة Provisioning
    الفاشلة.
4.  Data Retention / Data Deletion سياسة مستقلة.
5.  ممنوع تدمير Tenant Business Data بصورة صامتة أثناء إزالة Module.

------------------------------------------------------------------------

# 14. Workstream J --- حدود Routes الحالية

يجب مراجعة Tenant application routes الموجودة حاليًا في `web.php`.

أي Route يجب أن يعمل داخل Tenant Context يجب نقله أو تسجيله داخل Tenant
Route Boundary المناسب.

وفي المقابل:

-   Platform Routes تبقى ضمن Platform Boundary.
-   Public Onboarding Routes تبقى ضمن الـ Central Boundary.
-   لا يجوز إنشاء Duplicate Routes.
-   يجب الحفاظ على السلوك الصحيح للـ Onboarding وPlatform
    Administration.

ويجب أن يكون تحديد Tenant ناتجًا عن Request / Domain Context، وليس عن
`session('tenant_id')` باعتباره المصدر الأساسي.

------------------------------------------------------------------------

# 15. Onboarding ضمن Sprint 3

Sprint 3 لا يعيد تصميم دورة Onboarding.

الدورة المعتمدة هي:

``` text
Registration
    ↓
Approval
    ├── Create Tenant
    ├── Create / Reserve Subdomain
    └── Send Activation Link
            ↓
        Activation
            ↓
      Data Collection
            ↓
        Provisioning
            ├── Database
            ├── Migrations
            ├── Base Data
            └── Initial Admin
            ↓
       Active Tenant
```

يجب أن يتوافق التنفيذ مع هذا الفصل:

-   Tenant Creation في Approval.
-   Tenant Provisioning يبدأ بعد Activation وData Collection.
-   Provisioning ليس هو Registration.
-   Tenant يصبح Active بعد نجاح Provisioning.

------------------------------------------------------------------------

# 16. حدود Authorization

## مسؤوليات Platform

-   Tenant Resolution
-   Tenant Context
-   Subscription / Module Availability
-   Platform Authorization
-   Module Registry
-   Module Lifecycle Governance

## مسؤوليات Module

-   Controllers
-   Models
-   Requests
-   Services
-   Policies
-   Routes
-   Business Logic
-   Business Data
-   Module-specific Roles / Permissions / Policies

لا يجوز للمنصة إنشاء Authorization Layer ثانية تحل محل Module
Authorization.

------------------------------------------------------------------------

# 17. عقد الاختبارات

لا يعتبر Sprint 3 مكتملًا إلا بعد إثبات السلوك المعماري بالاختبارات.

## Tenant Isolation

1.  طلب Tenant A يصل إلى Tenant A فقط.
2.  طلب Tenant B يصل إلى Tenant B فقط.
3.  لا يستطيع مستخدم Tenant A الوصول إلى Tenant B بتغيير Session Value.
4.  لا يمكن اكتشاف User عن طريق Global Tenant Database Scan.
5.  إذا تكرر نفس Email في Tenant A وTenant B، يبقى المستخدم غير ملتبس
    لأن Tenant Context حُدد أولًا.

## Platform Isolation

6.  Platform Login يبحث فقط في Platform / Landlord Identity.
7.  Tenant Login لا يصادق باستخدام Platform Users.
8.  Tenant Users لا يستطيعون الدخول إلى Platform Administration.
9.  Platform Users لا يحصلون على Tenant Business Data من Platform
    Administration.

## Intended URI

10. الطلب المحمي يحتفظ بالـ Intended URI.
11. بعد نجاح Authentication يعود المستخدم إلى URI المقصود إذا كان مخولًا.
12. دخول Tenant Root بدون Intended URI يمكن أن يذهب إلى Tenant
    Dashboard.

## User Status

13. Active Tenant User يستطيع Authentication.
14. Suspended / Inactive User لا يستطيع تنفيذ Protected Operations.

## Subscription / Module Availability

15. Module المفعلة تكون متاحة لـ Tenant المخول.
16. Module غير المفعلة ترفض قبل تنفيذ Business Logic.
17. تمكين Module في Tenant لا يؤثر على Tenant آخر.

## Authorization

18. Module Route المحمية بـ `auth` تتطلب Authentication.
19. Role / Permission / Policy الخاصة بالـ Module تظل تحت مسؤولية
    Module.
20. إزالة Permission تمنع العملية المحمية.
21. Public Route لا تنفذ Permission Lookup غير الضروري.

## Provisioning

22. Provisioning الناجح ينتج عنه حالة Registered / Installed / Ready
    الصحيحة.
23. الفشل أثناء Provisioning يطلق Rollback / Compensation.
24. Rollback يزيل Partial State.
25. Module الفاشلة لا تبقى في Ready State.
26. Deprovisioning لوحدة مثبتة مختلف عن Rollback.
27. Deprovisioning لا يحذف Business Data تلقائيًا.

------------------------------------------------------------------------

# 18. Regression Requirement

يجب أن تستمر اختبارات Sprint 1 وSprint 2 في النجاح، باستثناء الاختبارات
التي تثبت سلوكًا أصبح مخالفًا لقرار معماري معتمد.

إذا تعارض اختبار قديم مع Architecture معتمدة:

1.  يتم تحديد التعارض.
2.  يتم تحديث الاختبار.
3.  يتم توثيق سبب التغيير في تقرير التنفيذ.

ولا يجوز استخدام Sprint 3 كذريعة لإدخال Refactoring غير مرتبط بالنطاق.

------------------------------------------------------------------------

# 19. قواعد التنفيذ لـ Antigravity

يجب على Antigravity:

1.  قراءة الوثائق الحالية قبل تعديل الكود.
2.  الالتزام بترتيب السلطة المعتمد.
3.  استخدام Laravel-native Patterns حيثما كان ذلك مناسبًا.
4.  إعادة استخدام الخدمات الحالية إذا كانت ما زالت صحيحة معماريًا.
5.  تجنب Speculative Abstractions.
6.  عدم إدخال Microservices أو Infrastructure غير مطلوبة.
7.  إبقاء Business Logic الخاصة بالـ Modules خارج Platform Core.
8.  إضافة Automated Tests لكل سلوك معماري جديد.
9.  تشغيل Tests وFormatting وStatic Checks المناسبة.
10. تقديم قائمة بالملفات المعدلة.
11. توضيح السبب المعماري للتغييرات المهمة.
12. تسجيل العناصر المؤجلة وسبب تأجيلها.
13. التوقف إذا تطلب التنفيذ تغيير ADR أو مبدأ معماري معتمد.

------------------------------------------------------------------------

# 20. التغييرات الممنوعة

لا يجوز لـ Antigravity:

-   تعديل ADR معتمد بصورة صامتة.
-   تعديل Architecture Blueprint بصورة صامتة.
-   إعادة Global Tenant User Discovery.
-   استخدام Email لاكتشاف Tenant.
-   استخدام `session('tenant_id')` كمصدر authoritative لتحديد Tenant.
-   إعطاء Platform Users وصولًا مباشرًا إلى Tenant Business Data.
-   دمج Platform Identity وTenant Identity.
-   إنشاء Direct Module-to-Module Database Access.
-   إنشاء Platform Authorization بديل لـ Module Authorization.
-   حذف Module Business Data كأثر جانبي صامت لـ Deprovisioning.
-   إضافة Billing / Payment / Event Bus / Microservices دون اعتماد
    مستقل.

------------------------------------------------------------------------

# 21. المخرجات المطلوبة --- Deliverables

يجب أن ينتج Sprint 3:

1.  Code يطبق قرارات Gate 1.
2.  Database Migrations اللازمة.
3.  Automated Tests.
4.  Minimal Module Metadata / Manifest Contract.
5.  Module Registry / Availability Mechanism.
6.  Module Provisioning Lifecycle.
7.  Provisioning Rollback / Compensation.
8.  Module Deprovisioning Lifecycle.
9.  Route / Request Context Handling الصحيح.
10. فصل Platform / Tenant Authentication.
11. Verification Report.
12. قائمة Changed Files.
13. قائمة Deferred Items وأسباب التأجيل.

------------------------------------------------------------------------

# 22. Definition of Done

يبقى **Gate 1 --- OPEN** حتى تتحقق جميع النقاط التالية:

-   [ ] Tenant Context محدد بصورة حتمية.
-   [ ] لا يوجد Cross-Tenant User Discovery.
-   [ ] Platform Identity منفصلة عن Tenant Identity.
-   [ ] Platform Authentication تستخدم Platform / Landlord Identity فقط.
-   [ ] Tenant Authentication تستخدم Tenant المحدد فقط.
-   [ ] Requested URI Preservation تعمل.
-   [ ] Subscription / Module Availability مطبقة.
-   [ ] Module تمتلك Internal Authorization.
-   [ ] Module Metadata / Manifest مسجلة.
-   [ ] Module Registry تعمل بالحد الأدنى المطلوب.
-   [ ] Module Provisioning يعمل.
-   [ ] فشل Provisioning يطلق Rollback / Compensation.
-   [ ] Deprovisioning منفصل عن Rollback.
-   [ ] Deprovisioning لا يحذف Business Data تلقائيًا.
-   [ ] Tenant Isolation Tests ناجحة.
-   [ ] Platform / Tenant Identity Isolation Tests ناجحة.
-   [ ] Module Availability Tests ناجحة.
-   [ ] Provisioning / Rollback / Deprovisioning Tests ناجحة.
-   [ ] Sprint 1 + Sprint 2 Regression Suite ناجحة.
-   [ ] Code Quality Checks ناجحة.
-   [ ] لا يوجد انتهاك لقرار معماري معتمد.

بعد تحقق جميع البنود فقط يمكن إغلاق:

**GATE 1 --- CLOSED**

------------------------------------------------------------------------

# 23. مبدأ التنفيذ النهائي

Sprint 3 يترجم Architecture المعتمدة إلى Code.

ولا يعيد تصميم Architecture أثناء التنفيذ.

التسلسل الحاكم:

``` text
Approved Decision
        ↓
Implementation
        ↓
Automated Verification
        ↓
Evidence
        ↓
Gate Closure
```

إذا كشف التنفيذ عن معلومة جديدة تجعل قرارًا قائمًا يحتاج إلى تصحيح:

``` text
Implementation Evidence
        ↓
Identify New Information
        ↓
Architectural Review
        ↓
Correct Decision if Necessary
        ↓
Update ADR / Architecture / Contract
        ↓
Continue Implementation
```

**تصحيح القرار عند ظهور معلومات جديدة مسموح.**

**تغيير المبادئ الأساسية دون قرار صريح غير مسموح.**

------------------------------------------------------------------------

# 24. حالة الوثيقة

**DRAFT --- جاهزة للمراجعة والاعتماد**

لا يبدأ تنفيذ Sprint 3 اعتمادًا على هذه المسودة باعتبارها نهائية، إلا بعد
اعتمادها من Product Owner / Lead Developer.
