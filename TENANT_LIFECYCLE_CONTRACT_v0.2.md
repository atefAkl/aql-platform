# Tenant Lifecycle Contract

**Status:** Approved  
**Version:** 0.2  
**Document Type:** Governance & Platform Contract  
**Scope:** Subscription Request Lifecycle, Tenant Record Lifecycle, Tenant Operational Lifecycle, and Onboarding/Provisioning boundaries

---

## 1. Purpose

يحدد هذا العقد الحدود والعلاقة بين أربع دوائر يجب عدم خلطها:

1. **Subscription Request Lifecycle**
2. **Tenant Record Lifecycle**
3. **Tenant Operational Lifecycle**
4. **Onboarding / Provisioning Process**

الهدف هو أن يكون هذا المستند مفهومًا لأصحاب القرار وملزمًا للمطورين والخدمات المركزية والوحدات والاختبارات.

هذا العقد لا يضيف Business Logic خاصًا بالـ Modules، ولا يستبدل أي ADR معتمد.

---

## 2. Governing Authority

تخضع هذه الوثيقة للقرارات المعمارية المعتمدة، وعلى رأسها:

- ADR-013 — Tenant Onboarding Lifecycle
- ADR-014 — Tenant Operational State
- ADR-018 — Subscription and Entitlement Chain
- ADR-020 — Audit
- ADR-021 — Tenant Request Flow
- ADR-023 — Module Provisioning Lifecycle
- ADR-024 — Module Deprovisioning

عند وجود تعارض بين هذا العقد وADR معتمد، تكون الأولوية للـ ADR المعتمد.

ولا يجوز استخدام هذه الوثيقة لتغيير ADR بصورة ضمنية.

إذا كشف التنفيذ عن تعارض أو فجوة حقيقية، يجب إيقاف الجزء المتأثر، توثيق التعارض، ورفعه للمراجعة؛ **ولا يجوز للمطور اختراع سلوك مؤقت أو Transition غير معتمد لسد الفجوة.**

---

## 3. Core Separation Principle

يجب عدم التعامل مع Lifecycle واحد يحتوي على كل المفاهيم.

النموذج الصحيح هو:

```text
Subscription Request
        │
        │ Approval
        ▼
Tenant Record
        │
        │ Activation / Data Collection / Provisioning
        ▼
Tenant Operational State
```

مع ملاحظة مهمة:

> **Provisioning عملية Preparatory Process وليست Lifecycle State.**

وبالتالي:

- `PENDING`, `APPROVED`, `COMPLETED` حالات للـ **Subscription Request** فقط.
- `ACTIVE`, `SUSPENDED`, `ARCHIVED` حالات تشغيلية للـ **Tenant**.
- `PROVISIONING` عملية وليست حالة Tenant.
- `provisioned` ليست Tenant Status.
- لا يجوز استخدام حالة من Lifecycle كبديل عن Process أو عن Lifecycle آخر.

### Golden Rule

> **No Lifecycle State May Be Used as a Substitute for a Process or Another Lifecycle.**

بالعربية:

> **لا يجوز استخدام حالة من دورة حياة كبديل عن عملية أو حالة من دورة حياة أخرى.**

---

## 4. Subscription Request Lifecycle

يمثل `Subscription Request` الطلب المقدم لإنشاء Tenant جديد.

الحالات المعتمدة هي **ثلاث حالات فقط**:

```text
PENDING
   │
   ▼
APPROVED
   │
   ▼
COMPLETED
```

ولا توجد ضمن هذا العقد حالة `REJECTED`.

إذا كانت الحاجة إلى الرفض مطلوبة مستقبلًا، فهذا قرار مستقل يجب اعتماده قبل إضافته إلى النموذج.

## 4.1 PENDING

الطلب مستلم وينتظر قرار الجهة المخولة.

في هذه المرحلة:

- لا يوجد Tenant Record تشغيلي ناتج عن الطلب.
- لا يوجد Tenant Database.
- لا يوجد Initial Tenant Administrator.
- لا يكون Tenant Active.

السلوك الخارجي المناسب هو إظهار أن الطلب ما زال قيد المراجعة/الانتظار.

## 4.2 APPROVED

تمت الموافقة على الطلب.

عند هذه النقطة، ووفق ADR-013:

- يتم إنشاء **Tenant Record** في Landlord DB.
- يتم حجز/إنشاء Subdomain وفق السياسة المعتمدة.
- يتم إنشاء Activation Token.
- يتم إرسال Activation Link وفق آلية الإرسال المعتمدة.
- لا يكون Tenant Active بعد.
- لا يشترط أن تكون Tenant Database قد أنشئت بعد.
- لا يكون Initial Tenant Administrator قادرًا على الدخول إلى Tenant التشغيلي بعد.

`APPROVED` تعني أن الطلب اجتاز قرار الموافقة ودخل مسار استكمال إنشاء البيئة، وليست مرادفًا لـ `ACTIVE`.

## 4.3 COMPLETED

تعني أن مسار الطلب اكتمل بنجاح وفق شروط الـ onboarding المعتمدة.

الترتيب المنطقي هو:

```text
APPROVED
   │
   ▼
Activation
   │
   ▼
Data Collection
   │
   ▼
Provisioning
   │
   ▼
Tenant becomes ACTIVE
   │
   ▼
Request becomes COMPLETED
```

يجب ألا تستخدم `COMPLETED` كبديل عن Tenant `ACTIVE`.

---

## 5. Tenant Record Lifecycle

يبدأ وجود Tenant Record في **Landlord DB عند APPROVAL**.

وهذه نقطة جوهرية:

> **Tenant Record is created at Approval, not after Provisioning.**

لذلك لا يصح تمثيل النموذج على أنه:

```text
Request → Provisioning → Create Tenant
```

والصحيح:

```text
Request PENDING
      │
      │ APPROVE
      ▼
Tenant Record Created
      │
      │ Activation
      │ Data Collection
      │ Provisioning
      ▼
Tenant becomes ACTIVE
```

Tenant Record في الفترة بين Approval ونجاح Provisioning يمثل Tenant معتمدًا لكنه غير جاهز للتشغيل.

لا يجوز اعتبار هذه الفترة Tenant Operational State جديدة ما لم يصدر قرار مستقل يعرّف ذلك.

---

## 6. Onboarding and Provisioning Process

Onboarding وProvisioning **Processes** وليسا حالات Lifecycle.

المسار:

```text
APPROVED
   │
   ├── Activation
   │
   ├── Data Collection
   │
   └── Provisioning
          │
          ├── Create Tenant DB
          ├── Run Migrations
          ├── Create Base Data
          ├── Create Initial Tenant Admin
          └── Complete Required Environment Setup
                  │
                  ▼
             Provisioning Success
                  │
                  ▼
             Tenant = ACTIVE
                  │
                  ▼
          Request = COMPLETED
```

### قاعدة إلزامية

لا يجوز تخزين أو تفسير:

```text
tenant.status = provisioned
```

على أنه Tenant Lifecycle State.

إذا كان التنفيذ يحتاج إلى معرفة أن Provisioning جارٍ أو اكتمل أو فشل، فيجب استخدام **Process/Provisioning state أو execution record مناسب** وفق التصميم الذي سيتم اعتماده، وليس إدخال `PROVISIONED` إلى Tenant Operational State.

---

## 7. Tenant Operational Lifecycle

بعد نجاح Provisioning يصبح Tenant:

```text
ACTIVE
```

وتبدأ هنا **Tenant Operational Lifecycle**.

الحالات التشغيلية المعتمدة حاليًا:

```text
ACTIVE
SUSPENDED
ARCHIVED
```

ولا تدخل `PENDING`, `APPROVED`, `COMPLETED`, أو `PROVISIONED` ضمن Tenant Operational States.

### 7.1 ACTIVE

الحالة التشغيلية الطبيعية للمستأجر.

كون Tenant `ACTIVE` لا يعني تلقائيًا:

- أن كل Modules متاحة.
- أن كل Features متاحة.
- أن كل Users مخولون.
- أن Subscription في حالة معينة.
- أن Billing مكتمل.

هذه أمور مستقلة تخضع لقواعدها الخاصة.

### 7.2 SUSPENDED

وفق ADR-014:

> Tenant Operational State منفصل عن Authentication State.

لذلك:

> `SUSPENDED` لا يعني تلقائيًا منع تسجيل الدخول.

Tenant في حالة Suspended يعمل في Limited Operating Mode، وما هو مسموح أو ممنوع تحدده Application/Module Policies المعتمدة.

لا يجوز لـ Core Platform اختراع قواعد Business Operation خاصة بالModules.

### 7.3 ARCHIVED

يمثل حالة تشغيلية يتم فيها الاحتفاظ ببيانات Tenant وفق سياسة الاحتفاظ المعتمدة.

وفق ADR-014:

- Archive ليس Delete.
- البيانات لا تحذف تلقائيًا بسبب Archive.
- سياسة الحذف مستقلة.

تفاصيل Restore/Retention/Delete تظل Deferred ما لم يعتمد لها قرار مستقل.

---

## 8. Deleted Is Not Currently a Tenant Operational State

لا يتم إدخال `DELETED` ضمن Tenant Operational Lifecycle الحالي.

الحذف يحتاج سياسة مستقلة تحدد على الأقل:

- الصلاحية.
- الشروط.
- الاحتفاظ.
- المتطلبات القانونية والتدقيقية.
- إمكانية الاستعادة.
- النطاق الفعلي للحذف.

إلى أن يعتمد هذا القرار:

> لا يجوز للمطور افتراض أن `ARCHIVED` يؤدي إلى `DELETED` أو أن الحذف عملية تلقائية.

---

## 9. Tenant State vs Request State

يجب أن يكون الفصل صريحًا:

| Concept                  | States / Meaning                 |
| ------------------------ | -------------------------------- |
| Subscription Request     | `PENDING → APPROVED → COMPLETED` |
| Tenant Record            | موجود منذ `APPROVED`             |
| Onboarding               | Process                          |
| Provisioning             | Process                          |
| Tenant Operational State | `ACTIVE / SUSPENDED / ARCHIVED`  |
| Module Availability      | مستقل                            |
| User Authorization       | مستقل                            |
| Billing / Payment        | مستقل                            |

ولا يجوز تحويل هذه الدوائر إلى State Machine واحدة.

---

## 10. URL / Access Behavior During Onboarding

يجب أن يعكس سلوك النظام حقيقة حالة Tenant دون خلط بين Request State وOperational State.

### 10.1 Request Pending

إذا كان الطلب:

```text
PENDING
```

ولم يتم إنشاء Tenant Record بعد:

```text
User Request
     ↓
System
     ↓
Wait / Pending Message
```

ولا يتم تقديم Tenant Dashboard.

### 10.2 Request Approved, Onboarding Incomplete

إذا كان الطلب:

```text
APPROVED
```

لكن Activation / Data Collection / Provisioning لم تكتمل:

```text
Tenant Record exists
        ↓
Onboarding incomplete
        ↓
Activation / Completion flow
```

عند محاولة الدخول إلى Tenant التشغيلي، يجب توجيه المستخدم إلى المسار المناسب لاستكمال onboarding وفق السياسة المعتمدة، مثل Activation Link أو Data Collection.

لا يجوز اعتبار Tenant `ACTIVE` قبل نجاح Provisioning.

### 10.3 Tenant Active

بعد:

```text
Provisioning Success
      ↓
Tenant = ACTIVE
```

يمكن للمستخدم الدخول وفق:

- Tenant Resolution
- Authentication
- Authorization
- Subscription
- Module Availability
- Module Authorization

وإذا كان هناك Requested URI محمي، فيجب الحفاظ عليه وإعادة المستخدم إليه بعد نجاح المصادقة والتفويض وفق ADR-021.

وإلا يتم استخدام Dashboard/Default landing page المعتمدة.

---

## 11. Platform Administration

Platform Administration هو الطرف المركزي المخول بإدارة قرارات Tenant Lifecycle.

عمليات تغيير Tenant Operational State يجب أن تكون:

- Authorized
- Explicit
- Audited
- Deterministic
- محكومة بالانتقالات المعتمدة

ولا يجوز للمطور تعديل الحالة من أماكن عشوائية مثل:

```php
$tenant->status = '...';
```

كبديل عن Lifecycle operation/command معتمد.

---

## 12. Transition Governance

كل Transition معتمد يجب أن يحدد:

```text
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
Audit
+
Failure / Recovery
```

لكن:

> **عدم وجود قرار معتمد بشأن Transition لا يبرر اختراع Transition.**

إذا واجه التنفيذ حالة لم يحدد العقد كيفية التعامل معها:

1. يتوقف التنفيذ المتأثر.
2. يتم توثيق الحالة.
3. يوضح أثرها.
4. يقترح المطور بدائل إن لزم.
5. ينتظر قرار Product Owner / Lead Developer / Architectural Review حسب طبيعة القرار.

---

## 13. Deferred Decisions Rule

الـ Deferred Decision ليست مساحة للمطور لعمل Temporary Policy.

تعني `DEFERRED`:

> **لم يتم اتخاذ القرار بعد، ولذلك لا يجوز افتراض السلوك.**

وبالتالي لا يجوز:

- اختراع Transition مؤقت.
- اعتبار حالة أخرى بديلة.
- استخدام `provisioned` كحل مؤقت.
- ربط حالتين لا يوجد قرار يربطهما.
- إضافة fallback غير موثق.
- تغيير معنى حالة موجودة لتغطية Gap.

إذا كان التنفيذ يحتاج هذا القرار لكي يستمر، يجب إيقاف الجزء المتأثر ورفع القرار.

---

## 14. Current Transition Model

الجزء المحسوم حاليًا:

### Request

```text
PENDING
   │
   ▼
APPROVED
   │
   │ Activation
   │ Data Collection
   │ Provisioning
   ▼
COMPLETED
```

### Tenant Record

```text
Created at APPROVAL
        │
        │ remains non-active during onboarding
        ▼
Provisioning Success
        │
        ▼
ACTIVE
```

### Tenant Operational Lifecycle

```text
ACTIVE
   │
   │ [future approved transition]
   ▼
SUSPENDED
   │
   │ [future approved transition]
   ▼
ARCHIVED
```

الأسهم التي لم يتم اعتماد شروطها بعد ليست Transitions تنفيذية.

---

## 15. Explicitly Forbidden State Mixing

يحظر:

1. `PENDING` كـ Tenant status.
2. `APPROVED` كـ Tenant status.
3. `COMPLETED` كـ Tenant operational status.
4. `PROVISIONED` كـ Tenant operational status.
5. استخدام `tenant.status` لتمثيل Request lifecycle.
6. استخدام Request status لتمثيل Tenant operational state.
7. اعتبار Provisioning Lifecycle State داخل Tenant Operational Lifecycle.
8. اعتبار Activation هو نفسه Tenant Activation/Active state.
9. اعتبار Approval = Active.
10. اعتبار Provisioning = Tenant State.
11. إضافة `REJECTED` إلى Request states دون قرار.
12. إضافة `DELETED` إلى Tenant operational states دون قرار.

---

## 16. Failure and Recovery

Provisioning عملية متعددة الخطوات وقد تفشل.

وفق المبادئ المعتمدة، يجب أن يؤدي الفشل إلى:

```text
Provisioning
      │
      ▼
Failure
      │
      ▼
Rollback / Compensation
      │
      ▼
Previous Valid State
```

ولا يجوز أن يؤدي فشل Provisioning إلى:

```text
Tenant = ACTIVE
```

ولا يجوز اعتبار Request `COMPLETED` قبل نجاح الشروط المطلوبة للإكمال.

تفاصيل Recovery/Retry التي لم تعتمد بعد تظل Deferred ولا يجوز اختراعها أثناء التنفيذ.

---

## 17. Audit

الانتقالات والعمليات المؤثرة في Lifecycle يجب أن تكون قابلة للتدقيق.

بحسب طبيعة العملية، يجب تسجيل:

- Actor / Source
- Entity
- Previous State
- New State
- Timestamp
- Command / Operation
- Relevant Context
- Result
- Failure Information عند وجودها

ويجب الحفاظ على الفصل بين:

```text
Platform Audit
Tenant Audit
```

وفق ADR-020.

---

## 18. Deferred Decisions

تبقى النقاط التالية خارج نطاق الحسم الحالي ما لم يعتمد لها قرار مستقل:

- شروط `ACTIVE → SUSPENDED`.
- شروط `SUSPENDED → ACTIVE`.
- شروط `SUSPENDED → ARCHIVED`.
- هل `ARCHIVED → ACTIVE` مسموح.
- Restore workflow.
- Retention Policy.
- Delete Policy.
- العلاقة بين Billing/Payment وTenant Suspension.
- العلاقة بين Subscription expiration وTenant State.
- سياسات Module behavior أثناء Suspension/Archive.
- سياسات Automated Approval/Rejection.
- تفاصيل Provisioning retry/recovery.
- أي Feature/Entitlement restrictions إضافية.
- تفاصيل Subscription Plans/Pricing/Billing.
- أي حالات جديدة لأي Lifecycle.

**وجود هذه العناصر في Deferred Decisions يعني أنها غير محسومة، وليس أنها قابلة للتخمين أثناء التنفيذ.**

---

## 19. Acceptance Principles

يكون التنفيذ مطابقًا للعقد عندما يمكن إثبات:

### 19.1 Subscription Request

- الحالات الوحيدة هي `PENDING`, `APPROVED`, `COMPLETED`.
- `PENDING → APPROVED` مسار الموافقة.
- `APPROVED → COMPLETED` لا يحدث إلا بعد اكتمال المسار المطلوب.
- لا توجد حالة `REJECTED` دون قرار مستقل.
- لا توجد حالة `PROVISIONED` ضمن Request states.

### 19.2 Tenant Record

- Tenant Record يُنشأ عند Approval.
- Tenant ليس Active عند Approval.
- Tenant لا يصبح Active قبل نجاح Provisioning.

### 19.3 Provisioning

- Provisioning عملية وليست Tenant State.
- فشل Provisioning لا ينتج Tenant Active.
- لا تستخدم `tenant.status = provisioned`.

### 19.4 Tenant Operational Lifecycle

- الحالات التشغيلية الحالية: `ACTIVE`, `SUSPENDED`, `ARCHIVED`.
- Request states لا تظهر في Tenant status.
- Tenant State مستقل عن Subscription State.
- Tenant State مستقل عن Module Availability.
- Archive لا يعني Delete.

### 19.5 Governance

- كل Transition تنفيذي معتمد ومصرح به.
- كل Transition مؤثر قابل للتدقيق.
- Deferred Decisions لا تتحول إلى افتراضات تنفيذية.
- عند وجود Gap أو Conflict، يتوقف التنفيذ المتأثر بدل اختراع سلوك.

---

## 20. Change Control

هذه الوثيقة Contract وليست بديلًا عن ADR.

إذا أضاف التغيير قرارًا معماريًا جديدًا:

1. يتم تحديد القرار.
2. يتم تقييم أثره.
3. يتم تحديث/إنشاء ADR عند الحاجة.
4. يتم تحديث Architecture/Platform Contract عند الحاجة.
5. يتم تحديث الاختبارات والعقد.
6. بعد الاعتماد فقط يصبح التغيير ملزمًا للتنفيذ.

---

## 21. Current Status

**Status:** Approved  
**Version:** 0.2

هذه النسخة تصحح النموذج المفاهيمي في النقاط التالية:

- Tenant Record يُنشأ عند `APPROVED`.
- Request states محصورة في `PENDING / APPROVED / COMPLETED`.
- Provisioning عملية وليست Tenant state.
- `PROVISIONED` ممنوعة كـ Tenant status.
- Tenant Operational Lifecycle منفصل عن Request Lifecycle.
- Tenant Operational States الحالية: `ACTIVE / SUSPENDED / ARCHIVED`.
- Deferred Decisions لا يجوز للمطور ملؤها بافتراضات أو Workarounds.
- عند وجود Gap أو Conflict يجب التوقف والتصعيد.

**لا تعتبر الوثيقة Approved قبل المراجعة والاعتماد الصريح.**
