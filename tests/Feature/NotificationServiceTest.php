<?php

namespace Tests\Feature;

use App\Services\NotificationService;
use Tests\TestCase;

class NotificationServiceTest extends TestCase
{
    public function test_notification_service_flashes_success_notification()
    {
        $service = new NotificationService;
        $service->success('تم إجراء العملية بنجاح.');

        $this->assertEquals('تم إجراء العملية بنجاح.', session('success'));
        $notifications = session('notifications');
        $this->assertIsArray($notifications);
        $this->assertCount(1, $notifications);
        $this->assertEquals('success', $notifications[0]['type']);
        $this->assertEquals('تم إجراء العملية بنجاح.', $notifications[0]['message']);
    }

    public function test_notification_service_flashes_error_notification()
    {
        $service = new NotificationService;
        $service->error('حدث خطأ أثناء المعالجة.');

        $this->assertEquals('حدث خطأ أثناء المعالجة.', session('error'));
        $notifications = session('notifications');
        $this->assertIsArray($notifications);
        $this->assertEquals('error', $notifications[0]['type']);
    }

    public function test_notification_service_flashes_warning_notification()
    {
        $service = new NotificationService;
        $service->warning('تنبيه: نرجو مراجعة البيانات.');

        $this->assertEquals('تنبيه: نرجو مراجعة البيانات.', session('warning'));
        $notifications = session('notifications');
        $this->assertIsArray($notifications);
        $this->assertEquals('warning', $notifications[0]['type']);
    }

    public function test_notification_service_flashes_info_notification()
    {
        $service = new NotificationService;
        $service->info('لم يتم تغيير أي بيانات.');

        $this->assertEquals('لم يتم تغيير أي بيانات.', session('info'));
        $notifications = session('notifications');
        $this->assertIsArray($notifications);
        $this->assertEquals('info', $notifications[0]['type']);
    }

    public function test_notification_service_supports_multiple_notifications()
    {
        $service = new NotificationService;
        $service->info('معلومة أولية.');
        $service->warning('تحذير ثانوي.');

        $notifications = session('notifications');
        $this->assertCount(2, $notifications);
        $this->assertEquals('info', $notifications[0]['type']);
        $this->assertEquals('warning', $notifications[1]['type']);
    }
}
