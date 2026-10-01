<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\PlatformUser;
use App\Models\Tenant;
use App\Models\TenantSubscription;
use Tests\TestCase;

class PlanManagementTest extends TestCase
{
    protected PlatformUser $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = PlatformUser::factory()->create([
            'email' => 'planadmin_'.rand(10000, 99999).'@example.com',
        ]);
    }

    public function test_platform_admin_can_view_plans_list()
    {
        Plan::query()->delete();
        Plan::factory()->create(['name' => 'خطة الأعمال الأساسية']);

        $response = $this->actingAs($this->admin, 'platform')
            ->get('/admin/plans');

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Platform/Plans/Index')
            ->has('plans', 1)
        );
    }

    public function test_creating_plan_triggers_success_notification()
    {
        $response = $this->actingAs($this->admin, 'platform')
            ->post('/admin/plans', [
                'name' => 'الباقة الاحترافية',
                'description' => 'باقة تناسب الشركات الكبيرة',
                'price' => 199.99,
            ]);

        $response->assertRedirect('/admin/plans');
        $this->assertDatabaseHas('plans', [
            'name' => 'الباقة الاحترافية',
            'price' => 199.99,
        ], 'pgsql');

        $this->assertEquals('تم إنشاء خطة الاشتراك بنجاح.', session('success'));
    }

    public function test_creating_plan_with_invalid_data_fails()
    {
        $response = $this->actingAs($this->admin, 'platform')
            ->post('/admin/plans', [
                'name' => '',
                'price' => 'invalid-price',
            ]);

        $response->assertSessionHasErrors(['name', 'price']);
        $this->assertEquals(0, Plan::where('name', '')->count());
    }

    public function test_updating_plan_without_changes_triggers_info_notification()
    {
        $plan = Plan::factory()->create([
            'name' => 'الباقة الذهبية',
            'description' => 'وصف ثابت',
            'price' => 150.00,
        ]);

        $response = $this->actingAs($this->admin, 'platform')
            ->put("/admin/plans/{$plan->id}", [
                'name' => 'الباقة الذهبية',
                'description' => 'وصف ثابت',
                'price' => 150.00,
            ]);

        $response->assertRedirect();
        $this->assertEquals('لم يتم إجراء أي تغييرات على الخطة.', session('info'));
    }

    public function test_updating_plan_successfully_triggers_success_notification()
    {
        $plan = Plan::factory()->create([
            'name' => 'الباقة الأولى',
            'description' => 'وصف قديم',
            'price' => 100.00,
        ]);

        $response = $this->actingAs($this->admin, 'platform')
            ->put("/admin/plans/{$plan->id}", [
                'name' => 'الباقة المحدثة',
                'description' => 'وصف قديم',
                'price' => 100.00,
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('plans', [
            'id' => $plan->id,
            'name' => 'الباقة المحدثة',
        ], 'pgsql');

        $this->assertEquals('تم تحديث خطة الاشتراك بنجاح.', session('success'));
    }

    public function test_changing_price_for_plan_with_active_subscribers_triggers_warning_notification()
    {
        $plan = Plan::factory()->create([
            'name' => 'الباقة الشائعة',
            'price' => 100.00,
        ]);

        $slug = 'plan-subscriber-'.rand(1000, 9999);
        Tenant::withoutEvents(function () use ($slug) {
            Tenant::create([
                'id' => $slug,
                'name' => 'شركة مشتركة',
                'status' => 'active',
            ]);
        });

        TenantSubscription::create([
            'tenant_id' => $slug,
            'plan_id' => $plan->id,
            'module_code' => 'expenses',
            'status' => 'active',
        ]);

        // Attempt price change without confirm_price_change
        $response = $this->actingAs($this->admin, 'platform')
            ->put("/admin/plans/{$plan->id}", [
                'name' => 'الباقة الشائعة',
                'price' => 120.00,
            ]);

        $response->assertRedirect();
        $this->assertEquals('تنبيه: تغيير سعر الخطة قد يؤثر على المشتركين الحاليين. هل ترغب في المتابعة؟', session('warning'));
        $this->assertTrue(session('requires_price_change_confirmation'));

        // Confirm price change
        $confirmResponse = $this->actingAs($this->admin, 'platform')
            ->put("/admin/plans/{$plan->id}", [
                'name' => 'الباقة الشائعة',
                'price' => 120.00,
                'confirm_price_change' => true,
            ]);

        $confirmResponse->assertRedirect();
        $this->assertEquals('تم تحديث خطة الاشتراك بنجاح.', session('success'));
        $this->assertDatabaseHas('plans', [
            'id' => $plan->id,
            'price' => 120.00,
        ], 'pgsql');
    }
}
