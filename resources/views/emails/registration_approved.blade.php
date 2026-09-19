<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تفعيل حساب المؤسسة - منصة عقل</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
            direction: rtl;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;
        }
        .header {
            background-color: #4f46e5;
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: 700;
        }
        .content {
            padding: 32px 24px;
            line-height: 1.7;
        }
        .content h2 {
            font-size: 18px;
            color: #0f172a;
            margin-top: 0;
        }
        .details-box {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 20px;
            margin: 24px 0;
            border-right: 4px solid #4f46e5;
        }
        .details-box p {
            margin: 6px 0;
            font-size: 14px;
        }
        .btn-container {
            text-align: center;
            margin: 32px 0;
        }
        .btn {
            background-color: #4f46e5;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        .footer {
            background-color: #f1f5f9;
            padding: 20px 24px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>منصة عقل AQL Platform</h1>
        </div>
        <div class="content">
            <h2>مرحباً {{ $registrationRequest->admin_name }}،</h2>
            <p>يسعدنا إبلاغك بأنه قد تم اعتماد طلب التسجيل الخاص بمؤسستك <strong>({{ $registrationRequest->organization_name }})</strong> بنجاح من قبل إدارة المنصة.</p>
            
            <div class="details-box">
                <p><strong>اسم المؤسسة:</strong> {{ $registrationRequest->organization_name }}</p>
                <p><strong>الرابط المخصص:</strong> {{ $registrationRequest->slug }}.aql-platform.local</p>
                <p><strong>البريد الإلكتروني للـ Admin:</strong> {{ $registrationRequest->admin_email }}</p>
            </div>

            <p>لطفاً اضغط على الزر أدناه لإكمال تفعيل الحساب وتعيين كلمة المرور للبدء في استخدام المنصة:</p>

            <div class="btn-container">
                <a href="{{ $activationUrl }}" class="btn" target="_blank">تفعيل الحساب وتعيين كلمة المرور</a>
            </div>

            <p style="font-size: 13px; color: #64748b;">ملاحظة: هذا الرابط صالِح لمدة 3 أيام فقط من تاريخ صدوره.</p>
            <p style="font-size: 12px; color: #94a3b8; word-break: break-all;">إذا لم يعمل الزر، يمكنك نسخ الرابط التالي ولصقه في المتصفح:<br>{{ $activationUrl }}</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} منصة عقل AQL Platform. جميع الحقوق محفوظة.</p>
        </div>
    </div>
</body>
</html>
