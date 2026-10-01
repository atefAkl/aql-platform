# C-001 — Platform User Management

## 1. تعريف العنصر

**C-001 — Platform User Management**

نظام إدارة مستخدمي منصة الإدارة، بدءًا من إنشاء الحساب وحتى إنهاء الحساب، مع إدارة:

* بيانات المستخدم.
* الربط الاختياري بالموظف.
* الأدوار.
* الصلاحيات.
* تفعيل الحساب.
* حالات الحساب.
* إيقاف/قفل الحساب.
* إنهاء الحساب.

وهو خاص بمستخدمي **Platform Administration**، وليس بمستخدمي الـTenants.

---

## 2. الهدف

توفير دورة حياة كاملة لمستخدم منصة الإدارة، مع فصل واضح بين:

```text
Identity
Authentication
Authorization
Profile
Employee Relationship
Account Lifecycle
```

بحيث لا يكون وجود المستخدم في النظام كافيًا لمنحه صلاحيات، ولا تكون بيانات الموظف أو المسمى الوظيفي هي التي تحدد صلاحياته.

---

# 3. نطاق C-001

### داخل النطاق

1. إنشاء Platform User.
2. إنشاء مستخدم مرتبط بموظف موجود.
3. إنشاء مستخدم بدون Employee Link.
4. تعديل بيانات المستخدم المسموح بها.
5. إدارة بيانات الملف الشخصي.
6. إدارة Employee Link.
7. إدارة Roles.
8. إدارة Permissions من خلال Roles.
9. إرسال Activation Link.
10. تفعيل الحساب.
11. إدارة حالات الحساب.
12. القفل الإداري.
13. القفل الأمني التلقائي.
14. إعادة فتح الحساب Disabled وفق الصلاحية والسياسة.
15. إنهاء الحساب Terminated.
16. منع إعادة تفعيل الحساب المنتهي.
17. الاحتفاظ ببيانات المستخدم المنتهي.
18. تطبيق Authorization الحالي بصورة فورية بعد تغيير الأدوار/الصلاحيات.

---

# 4. نموذج الهوية

Platform User كيان مستقل عن Employee.

```text
Platform User
      │
      │ optional
      ▼
   Employee
```

ليس كل Platform User موظفًا.

وبالتالي:

```text
Platform User
├── Employee-linked User
└── Non-Employee User
```

ولا يجوز افتراض وجود Employee Record لكل مستخدم.

---

# 5. بيانات المستخدم

### بيانات الحساب

* Username
* Email
* Phone
* Roles
* Employee Link — optional
* Employee Number — system-generated عندما يكون المستخدم مرتبطًا بموظف

### بيانات الملف الشخصي

يمكن للمستخدم إدارة بياناته الشخصية المسموح بها، مثل:

* Profile Photo
* Date of Birth
* Contact Information
* بيانات شخصية أخرى معتمدة

### بيانات محكومة بواسطة المنصة

لا يملك المستخدم تعديل:

* Username
* Employee Link
* Employee Number
* Account Status
* Assigned Roles
* System-generated/System-recorded data

---

# 6. Roles & Permissions

النموذج:

```text
Platform User
      │
      │ M:N
      ▼
     Role
      │
      │ M:N
      ▼
 Permission
```

### Permission

هي أصغر وحدة قابلة لمنح صلاحية.

ويجب أن تمثل صلاحية محددة على Resource أو Action.

### Role

مجموعة من Permissions.

يمكن للمستخدم امتلاك أكثر من Role.

يمكن للـPermission أن تكون موجودة في أكثر من Role.

لا يوجد مفهوم مستقل باسم **Permission Group** ضمن هذا التصميم.

---

# 7. Employee → Platform User

عند إنشاء مستخدم من موظف موجود:

```text
Promote Employee
        │
        ▼
Select Employee
        │
        ▼
Load Employee Data
        │
        ▼
Populate User Form
        │
        ▼
Complete / Modify Required Data
        │
        ▼
Create Platform User
```

يتم استخدام بيانات الموظف المتاحة كأساس، مع السماح للإدارة باستكمال أو تعديل البيانات المطلوبة لإنشاء الحساب.

بعد إنشاء الحساب:

```text
Employee
   ↓
Platform User
   ↓
Activation Link
   ↓
Account Activation
```

---

# 8. Activation

Activation Link هو وسيلة لتفعيل الحساب، وليس Invitation.

عند إنشاء الحساب:

```text
created_at     = creation timestamp
activated_at   = NULL
status         = Pending
```

بعد التفعيل:

```text
activated_at   != NULL
status         = Active
```

### قواعد Activation

* الرابط مؤقت.
* الرابط Single-use.
* الرابط مرتبط بالحساب.
* الرابط ينتهي بعد مدة محددة.
* مدة الصلاحية ستكون Configuration/Policy.
* المستخدم لا يختار Roles أثناء التفعيل.
* Roles يتم تعيينها إداريًا قبل التفعيل.
* لا يجوز أن يكون المستخدم بدون Role.
* يمكن تعديل Roles للمستخدم Pending.
* لا يتم منح الوصول التشغيلي قبل اكتمال التفعيل.

---

# 9. Account Lifecycle

الحالات المعتمدة:

```text
Pending
Active
Locked
Disabled
Terminated
```

## Pending

الحساب تم إنشاؤه ولم يتم تفعيله.

```text
Access = No
```

## Active

الحساب فعال ويمكن استخدامه وفق الصلاحيات الممنوحة.

## Locked

الحساب مقفول مؤقتًا.

مصدر القفل يمكن أن يكون:

```text
Administrator
      OR
Security Mechanism
```

ويمكن العودة من Locked إلى Active وفق السياسة والصلاحية.

## Disabled

الحساب موقوف إداريًا.

يمكن للمسؤول المخول إعادة فتح الحساب وفق الإجراء الإداري المعتمد.

## Terminated

انتهت علاقة المستخدم بالمنصة.

```text
Login            = Denied
Reactivation     = Forbidden
Re-registration = Forbidden
Data             = Retained
```

والحساب لا يعود إلى Active.

---

# 10. Transition Rules

القواعد الوظيفية الأساسية:

```text
Pending → Active
Active → Locked
Locked → Active
Locked → Disabled
Locked → Terminated
Disabled → Active
```

ولا يسمح بـ:

```text
Active → Disabled       ✗
Active → Terminated     ✗
Terminated → Active     ✗
Terminated → Pending    ✗
Terminated → Locked     ✗
```

وبالتالي:

```text
Active
  │
  └──→ Locked
          ├──→ Active
          ├──→ Disabled
          └──→ Terminated
```

---

# 11. Authorization Changes

تغييرات Roles/Permissions يجب أن تصبح فعالة فورًا في عمليات Authorization التالية.

لا يجوز الاعتماد على صلاحيات قديمة محفوظة في Session أو Client أو أي حالة قديمة غير invalidated.

المبدأ:

```text
Request
   ↓
Current Authorization State
   ↓
Allow / Deny
```

وتفاصيل آلية تنفيذ ذلك تظل **Technical Implementation Decision**، وليست Business Rule.

---

# 12. Automatic Lock

C-001 يدعم Automatic Security Lock.

لكن:

> **شروط القفل التلقائي وقيمه ليست جزءًا ثابتًا من C-001.**

سيتم تحديدها لاحقًا كـSecurity/Configuration Policy.

مثلًا لاحقًا يمكن أن تصبح:

```text
Security Settings
├── Failed Login Threshold
├── Lock Duration
├── Automatic Unlock Policy
└── Other Security Controls
```

ولا يتم Hard-code لهذه القيم داخل User Management.

---

# 13. Authentication Security

التنفيذ يجب أن يعتمد على الممارسات والمعايير الأمنية المعتمدة بدل اختراع آليات خاصة بالمنصة.

ويشمل ذلك خصوصًا:

* Secure password handling.
* Secure activation tokens.
* Token expiration.
* Single-use activation.
* Session security.
* Authorization verification.
* Account-state enforcement.
* Protection against brute-force/abuse.
* Secure credential lifecycle.

**ولا نحول هذه النقاط إلى اختراعات خاصة بنا ما دام هناك Standard/Framework practice مناسب.**

---

# 14. User Ownership vs Platform Governance

| البيانات             | المالك/المتحكم           |
| -------------------- | ------------------------ |
| Profile Photo        | User                     |
| Date of Birth        | User                     |
| Contact Data         | User                     |
| Password             | User                     |
| Username             | Platform                 |
| Employee Link        | Platform                 |
| Employee Number      | Platform                 |
| Roles                | Platform Administration  |
| Account Status       | Platform                 |
| Security State       | Platform/Security Policy |
| System-recorded Data | Platform                 |

---

# 15. Out of Scope

C-001 لا يشمل:

* Employee Management.
* HR.
* Employee Portal.
* Organizational Structure.
* Attendance.
* Payroll.
* Performance Management.
* Audit Trail.
* Tenant User Management.
* Tenant Roles/Permissions.
* Billing.
* Notification Service كميزة مستقلة.
* Security Policy Management كميزة مستقلة.

مع ملاحظة أن C-001 **يستخدم** القدرات المشتركة الموجودة بالمنصة، ولا يعيد بناءها داخله.

---

# 16. Acceptance Criteria

### Account

* [ ] يمكن إنشاء Platform User.
* [ ] يمكن إنشاء مستخدم مرتبط بموظف.
* [ ] يمكن إنشاء مستخدم بدون Employee Link.
* [ ] يتم إنشاء Employee Number تلقائيًا عند انطباق شرطه.
* [ ] لا يمكن للمستخدم تعديل البيانات المحكومة بواسطة المنصة.

### Activation

* [ ] الحساب الجديد يبدأ Pending.
* [ ] Activation Link آمن ومؤقت وSingle-use.
* [ ] لا يصبح الحساب Active قبل التفعيل.
* [ ] لا يستطيع المستخدم اختيار Roles أثناء Activation.
* [ ] لا يوجد مستخدم Active بدون Role.

### Authorization

* [ ] Users ↔ Roles Many-to-Many.
* [ ] Roles ↔ Permissions Many-to-Many.
* [ ] Permissions ذرية.
* [ ] تغييرات Roles تصبح فعالة فورًا.
* [ ] لا تعتمد Authorization على بيانات Session قديمة.

### Lifecycle

* [ ] Pending يعمل وفق قواعده المحددة.
* [ ] Active يعمل وفق الصلاحيات.
* [ ] Locked يمنع الاستخدام وفق Security Policy.
* [ ] Locked يمكن أن يعود Active وفق القواعد.
* [ ] Disabled يمكن إعادة فتحه بواسطة مسؤول مخول.
* [ ] Terminated لا يمكن إعادة تفعيله.
* [ ] بيانات Terminated لا تحذف تلقائيًا.
* [ ] الانتقالات غير المسموح بها يتم رفضها.

### Security

* [ ] القفل الإداري مدعوم.
* [ ] القفل الأمني التلقائي مدعوم.
* [ ] سياسات Automatic Lock قابلة للتهيئة مستقبلًا.
* [ ] كلمات المرور والتوكنات تخضع للممارسات الأمنية القياسية.
* [ ] لا يمكن تجاوز Account State عن طريق Request أو Session أو Client-side manipulation.

---

# 17. Definition of Done

يعتبر **C-001 — Platform User Management** مكتملًا عندما:

1. تكون دورة حياة Platform User من **Creation → Termination** مطبقة.
2. يكون Employee Link اختياريًا.
3. يكون RBAC مطبقًا.
4. تكون Permissions ذرية.
5. يكون Activation Lifecycle مطبقًا.
6. تكون Account States والانتقالات محكومة.
7. تكون Authorization فورية بعد التغيير.
8. تكون Security Controls الأساسية مطبقة وفق المعايير.
9. تكون Automated Tests تغطي:

   * Creation
   * Activation
   * Roles
   * Permissions
   * State transitions
   * Locking
   * Termination
   * Authorization changes
   * Security boundaries
10. لا يوجد تجاوز لحدود Platform Administration.
11. لا يوجد اعتماد على Employee Management غير الموجود بعد.
12. لا يتم إدخال Business Rules غير معتمدة.
13. لا يتم إعادة اختراع آليات Authentication/Authorization الموجودة في Laravel/الممارسات القياسية دون سبب معماري موثق.
