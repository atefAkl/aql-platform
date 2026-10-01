# C-002 — Tenant User Management

**Status: Approved**

---

## 1. Purpose

إدارة مستخدمي الـTenant من إنشاء الحساب وحتى إنهائه، مع توفير:

* Authentication
* Profile Management
* Roles
* Permissions
* Activation
* Account Lifecycle
* Locking
* Employee Linking عند توفر HR Module

مع الحفاظ على **العزل الكامل للـTenant** عن باقي الـTenants وعن Platform Administration.

---

## 2. Core Principle

> **كل Tenant هو جزيرة معزولة.**

Tenant User ينتمي إلى Tenant واحد فقط.

ولا يمكنه:

* الوصول إلى Tenant آخر.
* اكتشاف مستخدمي Tenant آخر.
* استخدام Role أو Permission من Tenant آخر.
* الوصول إلى Platform Administration.
* امتلاك Platform Role أو Platform Permission.

والعزل يجب أن يكون enforced server-side، وليس اعتمادًا على الواجهة أو Client-supplied Tenant ID.

---

# 3. Identity Model

```text
Platform Identity
      │
      └── Platform Users
           └── Platform Roles
                └── Platform Permissions


Tenant Identity
      │
      └── Tenant Users
           └── Tenant Roles
                └── Tenant Permissions
```

وهما نظامان مستقلان.

حتى إذا كان:

```text
Platform User Email
        =
Tenant User Email
```

فهما هويتان مستقلتان.

---

# 4. Tenant User Lifecycle

يستخدم C-002 نفس دورة C-001:

```text
Pending
   ↓
Active
   ↓
Locked
   ├──→ Active
   ├──→ Disabled
   └──→ Terminated

Disabled
   └──→ Active
```

ولا يسمح بـ:

```text
Active → Disabled
Active → Terminated

Terminated → Active
Terminated → Pending
Terminated → Locked
```

`Terminated` حالة نهائية للحساب.

---

# 5. User Creation

إنشاء Tenant User يتم **من داخل Tenant User Management فقط**.

لا يستطيع HR Module أو أي Module آخر إنشاء الحساب مباشرة.

إذا كان الـTenant يستخدم HR Module، يمكن ربط الحساب بموظف موجود:

```text
HR Employee
     │
     ▼
Tenant User
```

لكن HR يظل مالكًا لبيانات الموظف ودورة حياته.

### إذا لم يكن HR Module موجودًا

يمكن إنشاء Tenant User مستقلًا بدون Employee Link.

---

# 6. Employee Relationship

Employee Link:

```text
Tenant User
     │
     └── Employee Link (Optional)
```

ولا يصبح HR Module شرطًا لإنشاء المستخدم.

Tenant User Management لا يملك:

* Employee Record
* Employee Lifecycle
* Employment Data
* HR Business Logic

هذه مسؤولية HR Module إذا كان مثبتًا ومتاحًا للـTenant.

---

# 7. Roles & Permissions

النموذج:

```text
Tenant User
      │
      │ M:N
      ▼
Tenant Role
      │
      │ M:N
      ▼
Tenant Permission
```

القواعد:

* المستخدم يمكن أن يمتلك عدة Roles.
* Role يمكن أن يحتوي عدة Permissions.
* Permission يمكن أن تكون ضمن عدة Roles.
* Permission هي أصغر وحدة Authorization.
* لا يوجد Permission Group مستقل.
* لا يوجد مفهوم `Manage Users` كصلاحية مركبة إذا أمكن التعبير عنه بصلاحيات ذرية.

---

# 8. Minimum Role Rule

لا يجوز أن يوجد Tenant User بدون Role.

ينطبق ذلك منذ:

```text
Creation
   ↓
Pending
   ↓
Active
   ↓
Locked / Disabled
   ↓
Terminated
```

وعند تعديل Roles لا يجوز إزالة آخر Role للمستخدم.

---

# 9. Authorization Isolation

يجب أن يكون Tenant Authorization مستقلًا بالكامل.

لا يمكن:

```text
Tenant User
      ↓
Platform Role          ✗
Platform Permission    ✗
```

ولا:

```text
Platform Role
      ↓
Tenant Permission     ✗
```

ولا توجد آلية لدمج الصلاحيات بين النظامين.

والـAuthorization يجب أن تتحقق من:

```text
Identity
   +
Tenant Context
   +
Resource
   +
Permission
```

في كل Request.

وهذا يتوافق مع توصيات OWASP بشأن التحقق من الصلاحيات في كل Request ورفض الوصول افتراضيًا عند عدم وجود تصريح صريح. ([OWASP Cheat Sheet Series][1])

---

# 10. Tenant Isolation

كل عملية Tenant يجب أن تعمل داخل Tenant Context صحيح.

```text
Request
   ↓
Resolve Tenant
   ↓
Authenticate Tenant User
   ↓
Validate Tenant State
   ↓
Authorize User
   ↓
Access Tenant Resource
```

ولا يجوز أن يؤدي أي من التالي إلى تجاوز Tenant Boundary:

* URL manipulation
* Request parameter
* Hidden field
* Client-side Tenant ID
* Session manipulation
* Resource ID manipulation

والـTenant User لا يستطيع اختيار Tenant آخر للوصول إليه.

---

# 11. Subscription Boundary

لا يوجد Subscription للمستخدمين.

Subscription يكون على مستوى Tenant / Module:

```text
Tenant
   ↓
Subscription
   ↓
Module Availability
```

وليس:

```text
Tenant
   ↓
User Subscription
```

لذلك C-002 لا يحتوي على:

* User Seats
* Per-user Subscription
* User Billing
* User Quotas الناتجة عن Subscription

---

# 12. Activation

نفس مبدأ C-001:

```text
Create
  ↓
Pending
  ↓
Activation Link
  ↓
Activation
  ↓
Active
```

Activation Link:

* مؤقت.
* مرتبط بالحساب.
* Single-use.
* لا يستخدم بعد التفعيل.
* مدة صلاحيته Policy قابلة للتهيئة.

ولا يختار المستخدم Roles أثناء Activation.

الممارسات الأمنية الحديثة تدعم إدارة دورة حياة الـAuthenticators وربطها بالحساب وإدارة انتهاء/إلغاء صلاحيتها بصورة آمنة. ([NIST Pages][3])

---

# 13. Account Locking

يدعم النظام:

### Administrative Lock

يتم بواسطة مسؤول مخول.

### Automatic Security Lock

يتم بواسطة آلية أمنية.

لكن شروط الـAutomatic Lock:

> **ليست Business Rules ثابتة داخل C-002.**

وتُحدد لاحقًا ضمن Security Configuration، مثل:

```text
Failed Login Threshold
Observation Window
Lock Duration
Unlock Policy
```

وهذا يتفق مع توصيات OWASP التي تتعامل مع هذه القيم كجزء من سياسة Account Lockout، مع ضرورة مراعاة منع إساءة استخدامها في تعطيل حسابات المستخدمين. ([OWASP Cheat Sheet Series][2])

---

# 14. Immediate Authorization Changes

عند إضافة أو إزالة Role:

> يجب أن يظهر أثر التغيير فورًا في عمليات Authorization التالية.

لا يجوز الاعتماد على Permission Snapshot قديم دون آلية invalidation صحيحة.

والتنفيذ التفصيلي — Session / Cache / Database / Authorization Layer — **قرار تقني أثناء التنفيذ** وليس قرارًا وظيفيًا جديدًا.

---

# 15. User Profile

Tenant User يستطيع إدارة بيانات الملف الشخصي المسموح بها.

مثل:

* Profile Photo
* Date of Birth
* Contact Information
* Password
* Other approved profile information

بينما بيانات المنصة المحكومة تبقى خارج تحكم المستخدم، مثل:

* Username إذا اعتُبر Platform-controlled.
* Employee Link.
* Account Status.
* Roles.
* System-generated information.

---

# 16. Termination

عند Termination:

```text
Authentication = Denied
Authorization  = Denied
Reactivation   = Forbidden
Data           = Retained
```

ولا يتم حذف بيانات المستخدم تلقائيًا لمجرد Termination.

---

# 17. Security Requirements

التنفيذ يجب أن يستخدم المعايير والممارسات الأمنية المعتمدة بدل إنشاء آليات مخصصة بلا داعٍ.

يشمل ذلك:

* Secure password storage.
* Secure session management.
* Secure activation tokens.
* Token expiration.
* Single-use tokens.
* Server-side authorization.
* Least Privilege.
* Deny by Default.
* Protection against brute-force attacks.
* Account lockout controls.
* Secure handling of authentication errors.
* Session invalidation عند الحاجة.
* حماية من Tenant Enumeration وCross-Tenant Access.

OWASP يؤكد كذلك أهمية Server-side Session Management وعدم الاعتماد على Client-side storage للـauthentication tokens. ([OWASP Cheat Sheet Series][4])

---

# 18. Out of Scope

C-002 لا يشمل:

* HR Module.
* Employee Management.
* Payroll.
* Attendance.
* Tenant Organization Management.
* Platform User Management.
* Platform Roles/Permissions.
* User Subscription.
* User Billing.
* Audit Trail كميزة مستقلة.
* Security Configuration Management كميزة مستقلة.

C-002 **يستهلك** القدرات المشتركة للمنصة ولا يعيد بناءها.

---

# 19. Acceptance Criteria

### Account

* [ ] يمكن إنشاء Tenant User.
* [ ] يمكن إنشاء User بدون Employee Link.
* [ ] يمكن ربط User بموظف عند توفر HR Module.
* [ ] لا يستطيع HR أو أي Module إنشاء User مباشرة.
* [ ] يبدأ الحساب بحالة Pending.

### Activation

* [ ] Activation Link آمن.
* [ ] Single-use.
* [ ] Expiring.
* [ ] لا يصبح الحساب Active قبل التفعيل.
* [ ] المستخدم لا يختار Roles أثناء Activation.

### Authorization

* [ ] Users ↔ Roles = Many-to-Many.
* [ ] Roles ↔ Permissions = Many-to-Many.
* [ ] Permissions ذرية.
* [ ] لا يمكن User أن يمتلك صفر Roles.
* [ ] Role changes فعالة فورًا.
* [ ] لا توجد Platform Permissions في Tenant Authorization.

### Isolation

* [ ] User ينتمي إلى Tenant واحد.
* [ ] لا يمكن الوصول إلى User في Tenant آخر.
* [ ] لا يمكن الوصول إلى بيانات Tenant آخر.
* [ ] Client-supplied Tenant ID لا يتجاوز Tenant Context.
* [ ] Tenant User لا يستطيع دخول Platform Administration.
* [ ] Platform Identity وTenant Identity منفصلتان.

### Lifecycle

* [ ] Pending.
* [ ] Active.
* [ ] Locked.
* [ ] Disabled.
* [ ] Terminated.
* [ ] الانتقالات غير المسموحة مرفوضة.
* [ ] Terminated غير قابل لإعادة التفعيل.
* [ ] البيانات لا تحذف تلقائيًا عند Termination.

### Security

* [ ] Manual Lock.
* [ ] Automatic Security Lock.
* [ ] Lock policy قابلة للتهيئة مستقبلًا.
* [ ] Server-side authorization.
* [ ] Least Privilege.
* [ ] Deny by Default.
* [ ] Security controls مبنية على الممارسات القياسية.

---

# 20. Definition of Done

يعتبر **C-002** مكتملًا عندما:

1. تكتمل دورة Tenant User من Creation إلى Termination.
2. يكون Tenant User مستقلًا بالكامل عن Platform User.
3. يكون Tenant Identity منفصلًا عن Platform Identity.
4. يكون Tenant Authorization مستقلًا بالكامل.
5. يتم فرض Tenant Isolation server-side.
6. يكون Employee Link اختياريًا ومتكاملًا فقط مع HR Module عند توفره.
7. لا يستطيع أي Module إنشاء User Account خارج Tenant User Management.
8. لا يوجد User بدون Role.
9. تعمل Account States والانتقالات المحددة.
10. تكون Authorization Changes فورية.
11. يكون Automatic Lock قابلًا للتهيئة لاحقًا.
12. يتم استخدام المعايير والممارسات الأمنية القائمة بدل اختراع آليات جديدة.
13. تغطي الاختبارات:

    * User Creation
    * Activation
    * Roles
    * Permissions
    * Lifecycle
    * Locking
    * Termination
    * Cross-Tenant Isolation
    * Platform/Tenant Identity Isolation
    * Authorization
14. لا يوجد تعارض مع ADR-009 أو ADR-010 أو ADR-021.
15. لا يتم إدخال HR Business Logic داخل User Management.
