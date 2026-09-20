# Tenant Lifecycle Contract

**Status:** DRAFT  
**Version:** 0.1  
**Document Type:** Governance & Platform Contract  
**Scope:** Tenant Account Lifecycle and Subscription Request Lifecycle

---

## 1. Purpose

يحدد هذا العقد دورة حياة:

1. Subscription Request
2. Tenant Account

ويحدد العلاقة بينهما، والحـدود الفاصلة بين دورة طلب الاشتراك وبين دورة حياة حساب المستأجر بعد إنشائه.

يهدف العقد إلى توفير قواعد واضحة وملزمة لـ:

- أصحاب القرار.
- Platform Administration.
- المطورين.
- الخدمات المركزية.
- الوحدات Modules.
- الاختبارات الآلية.
- عمليات الانتقال المستقبلية من التشغيل اليدوي إلى التشغيل الآلي.

هذا العقد لا يحدد منطق الأعمال الخاص بكل Module، ولا يحول Platform إلى مالك لمنطق الأعمال الخاص بالمستأجر.

---

# 2. Governing Principles

تخضع هذه الوثيقة للقرارات المعمارية المعتمدة Architecture Decision Records، وخاصة:

- ADR-013 — Tenant Onboarding Lifecycle
- ADR-014 — Tenant Operational State
- ADR-015 — Module Installation vs Tenant Enablement
- ADR-016 — Module Business Ownership
- ADR-018 — Subscription and Entitlement Chain
- ADR-020 — Audit
- ADR-021 — Tenant Request Flow
- ADR-022 — Module Ownership
- ADR-023 — Module Provisioning Lifecycle
- ADR-024 — Module Deprovisioning

في حالة وجود تعارض بين هذه الوثيقة وADR معتمد، فإن الـ ADR المعتمد له الأولوية.

لا يجوز استخدام هذا العقد لتغيير قرار معماري معتمد بصورة ضمنية.

أي تغيير في قرار معماري يجب أن يتم من خلال عملية Architectural Decision المناسبة.

---

# 3. Core Concept

يجب الفصل بشكل صريح بين:
----------------------------------------------
Subscription Request
        │
        │ Onboarding / Provisioning
        ▼
Tenant Account
----------------------------------------------

وهما كيانان مختلفان، ولكل منهما دورة حياة مستقلة.

## 3.1 Subscription Request

يمثل طلبًا مقدمًا من طرف يرغب في إنشاء Tenant Account.

الطلب يمثل مرحلة ما قبل إنشاء الحساب.

## 3.2 Tenant Account

يمثل الحساب التشغيلي الفعلي للمستأجر بعد اكتمال عملية الـ onboarding والـ provisioning.


الحالة التشغيلية الأولى للحساب بعد نجاح عملية الإنشاء هي:
----------------------------------------------
ACTIVE
----------------------------------------------

---

# 4. Separation of Lifecycle Domains

يجب عدم استخدام حالة واحدة لتمثيل:

* Subscription Request
* Tenant Account
* Subscription
* Billing
* Payment
* Invoice
* Module Availability
* Module Enablement

هذه كيانات وحالات مختلفة.

بصورة مفاهيمية:
----------------------------------------------
Subscription Request
        │
        │ creates / provisions
        ▼
Tenant Account
        │
        ├── Subscription
        │
        ├── Module Availability / Enablement
        │
        ├── Billing
        │
        ├── Invoices / Installments
        │
        └── Payments
----------------------------------------------

وجود حالة معينة في أحد هذه الكيانات لا يعني تلقائيًا تغيير حالة الكيانات الأخرى، ما لم توجد Policy معتمدة تنص على ذلك.

---

# 5. Subscription Request Lifecycle

## 5.1 Purpose

Subscription Request هو سجل طلب إنشاء علاقة Tenant جديدة.

يمثل فترة محدودة تبدأ باستلام الطلب وتنتهي بإغلاق مسار الطلب.

---

## 5.2 Request States

الحالات الأساسية المعتمدة في هذا العقد هي:
----------------------------------------------
PENDING
   │
   ├──────────────► REJECTED
   │
   ▼
ACCEPTED
   │
   ▼
COMPLETED
----------------------------------------------

### PENDING

الطلب مستلم ولم يصدر بشأنه قرار نهائي.

### ACCEPTED

تم قبول الطلب من الجهة المخولة، ويبدأ النظام في تنفيذ مسار الـ onboarding المرتبط بالطلب.

### REJECTED

تم رفض الطلب.

هذه حالة نهائية.

### COMPLETED

اكتملت رحلة الطلب بنجاح، وتم إنشاء وتسليم Tenant Account وفق متطلبات الـ onboarding والـ provisioning.

هذه حالة نهائية.

---

# 6. Request Transition Rules

## 6.1 Allowed Transitions

المسارات المسموح بها:
----------------------------------------------
PENDING → ACCEPTED
PENDING → REJECTED
ACCEPTED → COMPLETED
----------------------------------------------

ولا توجد انتقالات أخرى في الإصدار الحالي من العقد.

---

## 6.2 Forbidden Transitions

يحظر النظام الانتقالات التالية:
---------------------------------------------
ACCEPTED → PENDING
REJECTED → PENDING
REJECTED → ACCEPTED
COMPLETED → ACCEPTED
COMPLETED → PENDING
COMPLETED → REJECTED
----------------------------------------------

كما يحظر تعديل الحالة النهائية للطلب بعد الوصول إليها.

---

# 7. Request Terminality

`REJECTED` و`COMPLETED` هما Terminal States.

بعد وصول Subscription Request إلى إحدى هذه الحالات:

* لا يعاد فتح الطلب.
* لا يعاد تشغيل دورة الطلب.
* لا يتم تغيير حالته.
* لا يتم تحويله إلى حالة أخرى.
* لا تتم إعادة معالجته كطلب نشط.

في النسخة التشغيلية النهائية، وبعد اكتمال الاختبارات والاعتماد:

> لا يجوز حذف Subscription Request من خلال عمليات التشغيل العادية.

يجب الاحتفاظ بالطلب كسجل تاريخي للقرار الذي اتخذ بشأنه.

---

# 8. Accepted Request and Onboarding

قبول Subscription Request لا يعني أن Tenant Account أصبح Active مباشرة.

بعد:
----------------------------------------------
PENDING → ACCEPTED
----------------------------------------------

يدخل الطلب في مسار الـ onboarding والـ provisioning المحدد في القرارات المعمارية المعتمدة.

المسار المفاهيمي:
----------------------------------------------
ACCEPTED
   │
   ▼
Activation
   │
   ▼
Data Collection
   │
   ▼
Tenant Provisioning
   │
   ├── Tenant Account
   ├── Domain
   ├── Database
   ├── Base Data
   └── Initial Administrator
   │
   ▼
COMPLETED
----------------------------------------------

لا يعتبر الطلب `COMPLETED` إلا بعد تحقق شروط الإكمال المطلوبة.

---

# 9. Request Completion and Tenant Handoff

عند نجاح الـ onboarding والـ provisioning:
----------------------------------------------
Subscription Request = COMPLETED
Tenant Account = ACTIVE
----------------------------------------------

يمثل ذلك نقطة انتقال واضحة بين مجالين:
----------------------------------------------
Request Lifecycle
       │
       │ Handoff
       ▼
Tenant Account Lifecycle
----------------------------------------------

لا تعتبر `COMPLETED` حالة من حالات Tenant Account.

ولا تعتبر `ACTIVE` حالة من حالات Subscription Request.

---

# 10. Tenant Account Lifecycle

يبدأ Tenant Account بعد اكتمال provisioning بنجاح.

الحالة الابتدائية:
----------------------------------------------
ACTIVE
----------------------------------------------

يتم تعريف حالات Tenant Account التشغيلية وفق ADR-014 والقرارات التي سيتم اعتمادها ضمن هذا العقد.

المسار الأساسي الحالي:
----------------------------------------------
ACTIVE
   ↕
SUSPENDED
   │
   ▼
ARCHIVED
----------------------------------------------

وسيتم التعامل مع `DELETED` ضمن سياسة مستقلة لم يتم اعتماد تفاصيلها بعد.

---

# 11. ACTIVE

يمثل Tenant Account في الحالة التشغيلية الطبيعية.

عند كون Tenant:
----------------------------------------------
ACTIVE
----------------------------------------------

يكون الحساب متاحًا للعمل وفق:

* Tenant Identity
* Tenant Authorization
* Subscription
* Module Availability
* Module Authorization
* Tenant-specific policies

ولا يعني Active أن جميع Modules متاحة أو مفعلة.

---

# 12. SUSPENDED

وفق ADR-014:

Tenant Operational State منفصل عن Authentication State.

لذلك:

> Suspended لا يعني بالضرورة منع تسجيل الدخول.

حالة Suspended تعني أن Tenant يعمل في Limited Operating Mode.

العمليات المسموح بها أثناء Suspension تحددها Application / Module Policies.

لا يجوز لـ Core Platform أن يضع منطقًا خاصًا بالعمليات التجارية الخاصة بكل Module.

---

# 13. ARCHIVED

يمثل Archived حالة يتم فيها الاحتفاظ ببيانات Tenant وفق سياسة الاحتفاظ المعتمدة.

وفق ADR-014:

* البيانات لا تحذف تلقائيًا.
* Archive ليس مرادفًا لـ Delete.
* سياسة الحذف مستقلة عن Archive.

تفاصيل:

* الاستعادة.
* مدة الاحتفاظ.
* شروط الحذف.
* العمليات المسموحة.
* الوصول إلى البيانات المؤرشفة.

تظل Deferred Decisions حتى يتم اعتماد سياسة صريحة لها.

---

# 14. DELETED

الحذف ليس جزءًا من الانتقال التشغيلي العادي الحالي.

سياسة Delete يجب أن تكون قرارًا مستقلًا يحدد:

* من يملك صلاحية الحذف.
* متى يسمح بالحذف.
* شروط الحذف.
* Data Retention.
* Legal / Audit requirements.
* هل الحذف نهائي.
* هل توجد Recovery capability.

إلى أن يتم اعتماد هذه السياسة:

> لا يجوز للمطور افتراض أن Archive يؤدي إلى Delete، ولا أن Delete عملية تلقائية.

---

# 15. Tenant Account vs Subscription

Tenant Account وSubscription كيانان منفصلان.

يمثل Tenant:
----------------------------------------------
الحساب التشغيلي
----------------------------------------------

بينما يمثل Subscription:
----------------------------------------------
العلاقة التجارية / الخطة / الاستحقاقات المرتبطة بالحساب
----------------------------------------------

يمكن أن يكون Tenant:
----------------------------------------------
ACTIVE
----------------------------------------------

بينما تكون تفاصيل Subscription مختلفة وفق النموذج التجاري المعتمد.

لا يجوز للمطور استخدام:
----------------------------------------------
tenant.status
----------------------------------------------

كمصدر وحيد لتحديد حالة Subscription.

كما لا يجوز استخدام Subscription Status كبديل عن Tenant Operational State.

---

# 16. Subscription Tier / Plan

درجة أو خطة الاشتراك تخص Tenant Account بعد إنشائه.

وهي ليست جزءًا من Lifecycle الخاص بـ Subscription Request.

المسار المفاهيمي:
----------------------------------------------
Tenant Account
      │
      └── Subscription
              └── Plan / Tier
----------------------------------------------

تفاصيل:

* Plans
* Pricing
* Entitlements
* Billing Rules

ليست جزءًا من Request Lifecycle.

---

# 17. Module Availability and Enablement

الوحدات Modules المرتبطة بحساب Tenant ليست حالات من حالات Tenant Lifecycle.

يجب الفصل بين:
----------------------------------------------
Tenant State
----------------------------------------------

و:
----------------------------------------------
Module Availability
Module Enablement
Module Authorization
----------------------------------------------

وفق القرارات المعتمدة:
----------------------------------------------
Subscription
      ↓
Module Availability
      ↓
Plan / Entitlement
      ↓
Feature / Capability
      ↓
User Permission
      ↓
Allow / Deny
----------------------------------------------

لا يعني:
----------------------------------------------
Tenant = ACTIVE
----------------------------------------------

أن جميع Modules متاحة أو مفعلة.

كما أن تعطيل Module لا يعني تلقائيًا تغيير Tenant Operational State.

---

# 18. Billing, Payments and Financial Records

المعلومات التالية تخص Tenant Account والعلاقة التجارية المرتبطة به، وليست جزءًا من Subscription Request Lifecycle:

* Payments
* Invoices
* Installments
* Billing Records
* Financial Transactions
* Other Commercial Records

لا يجوز استخدام هذه السجلات لتغيير Tenant State بصورة ضمنية ما لم توجد Business Policy معتمدة.

أي علاقة مستقبلية بين:
----------------------------------------------
Billing State
----------------------------------------------

و:

----------------------------------------------
Tenant Operational State
----------------------------------------------

يجب أن تكون معرفة بشكل صريح في Policy / ADR مستقلة.

---

# 19. Platform Administration

Platform Administration هو صاحب التحكم المركزي في Tenant Lifecycle.

يجب أن تكون عمليات تغيير Tenant State:

* Authorized
* Explicit
* Audited
* Deterministic
* Governed by allowed transitions

ولا يجوز تعديل Tenant State مباشرة من خلال:
----------------------------------------------
tenant.status = ...
----------------------------------------------

من أماكن عشوائية داخل التطبيق.

يجب أن تمر عملية تغيير الحالة عبر Lifecycle operation / command معتمد.

---

# 20. Lifecycle Transition Model

كل انتقال في دورة الحياة يجب أن يمكن وصفه بالمكونات التالية:
----------------------------------------------
Actor
   +
Command
   +
Current State
   +
Preconditions
   +
Target State
   +
System Actions
   +
Audit Event
   +
Failure / Recovery
----------------------------------------------

مثال مفاهيمي:
----------------------------------------------
Suspend Tenant

Actor:
    Authorized Platform Administrator

Current State:
    ACTIVE

Command:
    SuspendTenant

Preconditions:
    Transition is allowed

Target State:
    SUSPENDED

System Actions:
    Apply tenant operational state

Audit:
    Record transition

Failure:
    Tenant remains in previous valid state
----------------------------------------------

هذا المثال يوضح النموذج فقط، ولا يعتبر بحد ذاته تعريفًا لجميع Preconditions أو Side Effects.

---

# 21. Manual Governance Phase

في المرحلة الحالية يتم التعامل مع Subscription Requests بواسطة طرف مخول من Platform Administration.

الهدف من هذه المرحلة:

1. إثبات صحة Lifecycle.
2. إثبات صحة Transition Rules.
3. إثبات صحة Provisioning.
4. إثبات صحة Rollback / Recovery.
5. إثبات صحة Audit.
6. التأكد من أن النظام لا يسمح بانتقالات غير مصرح بها.

القرار البشري الحالي هو مصدر القرار.

---

# 22. Future Automation

يجب تصميم الـ Lifecycle بحيث يمكن لاحقًا استبدال القرار اليدوي بقرار آلي دون تغيير العقد نفسه.

المبدأ:
----------------------------------------------
                    Lifecycle Contract
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
        Manual Decision      Automated Decision
                 │                   │
                 └─────────┬─────────┘
                           ▼
                    Same Transition
----------------------------------------------

يجب ألا يكون للـ automated workflow قواعد Lifecycle مختلفة عن الـ manual workflow.

الاختلاف المستقبلي يكون في:
----------------------------------------------
Who / What decides
----------------------------------------------

وليس في:
----------------------------------------------
What transition means
----------------------------------------------

---

# 23. Audit

كل انتقال Lifecycle مؤثر يجب أن يكون قابلًا للتدقيق.

يجب أن يحتوي سجل الانتقال، بحسب طبيعة العملية، على:

* Actor / Source
* Entity
* Previous State
* New State
* Timestamp
* Operation / Command
* Relevant Context
* Result
* Failure information where applicable

يجب الحفاظ على الفصل بين:
----------------------------------------------
Platform Audit
----------------------------------------------

و:
----------------------------------------------
Tenant Audit
----------------------------------------------

وفق ADR-020.

---

# 24. Failure and Recovery

فشل أي عملية انتقال أو provisioning لا يجب أن يترك النظام في حالة غير معروفة أو غير صالحة.

يجب أن ينتج عن العملية إحدى الحالات:
----------------------------------------------
SUCCESS
----------------------------------------------

أو:
----------------------------------------------
FAILED → RECOVERED / COMPENSATED
----------------------------------------------

ولا يجوز اعتبار العملية ناجحة لمجرد بدء تنفيذها.

بالنسبة لعمليات provisioning التي تتضمن موارد متعددة، يتم تطبيق مبدأ التعويض والـ rollback وفق ADR-023.

---

# 25. Module Boundary

Platform Lifecycle Governance لا تعني أن Platform يمتلك Business Logic الخاص بالModules.

Platform مسؤول عن:

* Tenant lifecycle.
* Tenant context.
* Subscription metadata.
* Module availability.
* Platform-level governance.

Module مسؤول عن:

* Business Logic.
* Business Data.
* Module Policies.
* Module-specific operations.
* Module-specific behavior resulting from Tenant state where applicable.

لا يجوز لـ Platform إعادة تنفيذ Business Logic الخاص بـ Module.

---

# 26. Forbidden Implementations

يحظر على التنفيذ:

1. استخدام Subscription Request كبديل عن Tenant Account.
2. استخدام Tenant State كبديل عن Subscription State.
3. استخدام Subscription State كبديل عن Tenant State.
4. تغيير Request بعد وصوله إلى Terminal State.
5. إعادة فتح Rejected Request.
6. إعادة فتح Completed Request.
7. حذف Request من خلال العمليات التشغيلية العادية بعد اعتماد سياسة الاحتفاظ.
8. إنشاء Tenant Account في حالة Pending.
9. افتراض أن Accept Request يعني Tenant = Active.
10. افتراض أن Tenant = Active يعني أن جميع Modules متاحة.
11. ربط Billing أو Payment أو Invoice مباشرة بـ Tenant State دون Policy معتمدة.
12. تعديل Tenant State من أماكن عشوائية خارج Lifecycle Governance.
13. إضافة Module-specific Business Rules إلى Core Platform.
14. حذف Tenant Business Data تلقائيًا بسبب Archive.
15. اعتبار Deprovisioning مساويًا لـ Rollback.
16. السماح لعملية Lifecycle أن تتجاوز Authorization وAudit requirements.

---

# 27. Deferred Decisions

النقاط التالية لا يتم حسمها ضمن الإصدار الحالي إلا بعد قرار معماري / تجاري صريح:

* تفاصيل Subscription Plans / Tiers.
* Pricing.
* Billing.
* Payment lifecycle.
* Invoice lifecycle.
* Installment lifecycle.
* العلاقة بين عدم السداد وTenant Suspension.
* العلاقة بين Subscription expiration وTenant State.
* شروط `ACTIVE → SUSPENDED`.
* شروط `SUSPENDED → ACTIVE`.
* شروط `SUSPENDED → ARCHIVED`.
* هل `ARCHIVED → ACTIVE` مسموح.
* هل الاستعادة من Archive تحتاج Restore Workflow مستقل.
* Retention Policy.
* Delete Policy.
* Irreversible deletion requirements.
* Automated acceptance criteria.
* Automated rejection criteria.
* حدود تدخل Platform Administration بعد أتمتة قبول الطلب.
* Module behavior أثناء Tenant Suspension.
* Module behavior أثناء Tenant Archive.
* أي Entitlement / Feature-level restrictions مستقبلية.

---

# 28. Acceptance Principles

يعتبر Lifecycle implementation مطابقًا لهذا العقد عندما يستطيع النظام إثبات:

### Subscription Request

* PENDING يمكن أن ينتقل إلى ACCEPTED.
* PENDING يمكن أن ينتقل إلى REJECTED.
* ACCEPTED يمكن أن ينتقل إلى COMPLETED بعد نجاح onboarding.
* REJECTED حالة نهائية.
* COMPLETED حالة نهائية.
* لا يمكن إعادة فتح Request نهائي.
* لا يمكن حذف Request في النسخة التشغيلية المعتمدة.

### Tenant Account

* Tenant Account يبدأ ACTIVE بعد successful provisioning.
* Tenant lifecycle مستقل عن Request lifecycle.
* Tenant state لا يستخدم كبديل عن Subscription state.
* Subscription state لا يستخدم كبديل عن Tenant state.
* Module availability مستقلة عن Tenant state.
* Billing / Payment records مستقلة عن Tenant state ما لم توجد Policy معتمدة.
* Tenant transitions تخضع لـ authorization.
* Tenant transitions قابلة للتدقيق.

### Architecture

* لا يوجد cross-tenant access.
* لا يوجد global tenant discovery by email.
* Tenant context يحدد بصورة deterministic.
* Platform Identity وTenant Identity منفصلان.
* Platform Administration لا يدخل Tenant Business Data.
* Tenant User لا يدخل Platform Administration.
* Modules تحتفظ بملكية Business Logic الخاصة بها.

---

# 29. Change Control

هذه الوثيقة Contract وليست سجل قرارات معماري مستقل.

أي تغيير في هذا العقد يجب أن:

1. يحدد سبب التغيير.
2. يحدد الـ ADRs المتأثرة.
3. يحدد Architecture impact.
4. يحدد Platform Contract impact.
5. يحدد Test impact.
6. يمر بعملية Review / Approval.

إذا كان التغيير يضيف قرارًا معماريًا جديدًا، يجب تسجيله في ADR قبل اعتباره قاعدة ملزمة.

---

# 30. Current Status

**Status:** DRAFT

هذه الوثيقة لا تعتبر Contract معتمدًا للتنفيذ حتى يتم:

1. مراجعتها من أصحاب القرار.
2. اعتماد Lifecycle Model.
3. اعتماد Transition Rules.
4. اعتماد الحدود بين Request / Tenant / Subscription.
5. تحديد Deferred Decisions التي تحتاج قرارات مستقلة.
6. تحديث السجلات المعمارية ذات العلاقة عند الحاجة.
7. إصدار نسخة Approved.
