<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Platform Release History & Changelog Data Source
    |--------------------------------------------------------------------------
    |
    | Stores human-readable, version-controlled release entries for AQL Platform.
    | Released items are publicly viewable on GET /changelog.
    |
    */

    [
        'version' => 'v0.4.0',
        'sprint' => 'Sprint 04',
        'title' => 'إدارة دورة حياة المستأجر وحظر الكتابة عند التعليق (Tenant Lifecycle & Write-Blocker)',
        'date' => '2026-09-21',
        'status' => 'RELEASED',
        'summary' => 'تم في هذا الإصدار التمييز المعماري التام بين دورة طلب التسجيل والدورة التشغيلية للمستأجر، مع إدخال نمط Read-Only Mode لمنع أية تعديلات أثناء الإيقاف المؤقت، وفصل شاشة إدارة الحسابات عن طلبات التسجيل.',
        'categories' => [
            'added' => [
                'label' => 'ما الجديد',
                'items' => [
                    'إحداث صفحة صريحة لإدارة حسابات المؤسسات والمستأجرين التشغيلية على المسار /admin/tenants.',
                    'إضافة مفاتيح تحكم صريحة للمسؤولين لإيقاف المؤسسات (Suspend)، أرشفة المؤسسات (Archive)، واستعادتها (Restore).',
                    'إدراج وسيط حظر الكتابة PreventTenantWritesIfSuspended لحماية سياق المستأجر عند التعليق.',
                    'إضافة نظام سجل التحديثات والإصدارات المفتوح للعامة على المسار العام /changelog.',
                ],
            ],
            'changed' => [
                'label' => 'التغييرات المعمارية',
                'items' => [
                    'فصل دورة حياة طلب التسجيل (PENDING → APPROVED → COMPLETED / REJECTED) عن دورة المستأجر التشغيلية (ACTIVE → SUSPENDED → ARCHIVED).',
                    'جعل عمود status في جدول tenants مسموحاً أن يكون NULL كحالة ما قبل التشغيل (Pre-Operational Condition).',
                    'تعديل عملية التفعيل لتنفيذ التجهيز أولاً خارج Transaction، ثم تحديث الحساب لـ Active والطلب لـ Completed بشكل ذري عند النجاح فقط.',
                ],
            ],
            'improved' => [
                'label' => 'التحسينات',
                'items' => [
                    'تحديث واجهات الإدارة المركزية وحل مشكلة تضارب التسميات والشارات (Badges) للمؤسسات المفعلة والموقوفة.',
                    'دعم نمط القراءة فقط Read-Only Mode بالسماح لطلبات GET وحظر طلبات الكتابة POST/PUT/PATCH/DELETE عند إيقاف المستأجر.',
                ],
            ],
            'fixed' => [
                'label' => 'الإصلاحات',
                'items' => [
                    'إصلاح خطأ 419 Page Expired عند تسجيل الخروج بتهيئة سياق المستأجر قبل بدء الجلسات وفحص CSRF Tokens.',
                    'منع حذف طلبات التسجيل للحفاظ على الإلزام التاريخي لسجلات التدقيق (Immutability).',
                ],
            ],
        ],
    ],

    [
        'version' => 'v0.3.0',
        'sprint' => 'Sprint 03',
        'title' => 'تدعيم المعمارية وفصل هوية مدير المنصة (Architecture Hardening & Identity Isolation)',
        'date' => '2026-09-18',
        'status' => 'RELEASED',
        'summary' => 'تم في هذا الإصدار الاستجابة لبوابة القرارات الأولى (Gate 1)، وعزل هوية مديري المنصة عن هوية مستخدمي المستأجرين، وتأكيد تحديد سياق المستأجر بشكل حتمي.',
        'categories' => [
            'added' => [
                'label' => 'ما الجديد',
                'items' => [
                    'إدخال موديل وهيكل PlatformUser المعزول لإدارة المنصة المركزية.',
                    'إضافة حماية الصلاحيات المباشرة وقوالب الأدوار الهجينة للمستأجرين (ADR-003, ADR-005).',
                    'توفير موديول إدارة المصروفات المصغر للتحقق من الموديولات وتوفرها (Workstream D).',
                ],
            ],
            'changed' => [
                'label' => 'التغييرات المعمارية',
                'items' => [
                    'تطبيق العزل التام بين مصادقة مدير المنصة عبر auth:platform ومصادقة المستأجرين عبر auth:web.',
                    'فرض Deterministic Tenant Resolution بالاعتماد الصارم على النطاقات وحظر اختيار أول مستأجر تلقائياً.',
                ],
            ],
            'fixed' => [
                'label' => 'الإصلاحات',
                'items' => [
                    'منع مستخدمي المستأجر غير النشطين أو الموقوفين من فتح المسارات المحمية.',
                ],
            ],
        ],
    ],

    [
        'version' => 'v0.2.0',
        'sprint' => 'Sprint 02',
        'title' => 'موديول المصروفات وتكامل الواجهة السلسة (Expenses Validation Module)',
        'date' => '2026-09-16',
        'status' => 'RELEASED',
        'summary' => 'بناء أول تطبيق أعمال مصغر (Expenses Module) كـ Validation Module للتأكد من قدرة النواة المشتركة على استضافة التطبيقات المستقلة.',
        'categories' => [
            'added' => [
                'label' => 'ما الجديد',
                'items' => [
                    'بناء واجهات إدارة المصروفات وقائمة العمليات الحساسة Audit Trail.',
                    'توفير مكونات الواجهة المظلمة والفاتحة Light/Dark Mode ومرسل التنبيهات Toast System.',
                ],
            ],
        ],
    ],

    [
        'version' => 'v0.1.0',
        'sprint' => 'Sprint 01',
        'title' => 'النواة المشتركة وتجهيز المستأجرين (Platform Core Kernel & Multi-Tenancy Engine)',
        'date' => '2026-09-15',
        'status' => 'RELEASED',
        'summary' => 'التأسيس الأول لمنصة AQL Platform وتدشين محرك تعدد المستأجرين القائم على PostgreSQL Database Per Tenant وإدارة النطاقات الفرعية.',
        'categories' => [
            'added' => [
                'label' => 'ما الجديد',
                'items' => [
                    'دمج حزمة stancl/tenancy وتكامل محرك Laravel 11 مع Inertia React & Tailwind CSS.',
                    'إحداث خدمة التجهيز الآلي قواعد بيانات المستأجرين TenantProvisioningService.',
                ],
            ],
        ],
    ],
];
