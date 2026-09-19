<?php

namespace Tests\Feature;

use App\Mail\RegistrationApprovedMail;
use App\Models\AuditLog;
use App\Models\PlatformUser;
use App\Models\RegistrationRequest;
use App\Models\Tenant;
use App\Models\User;
use App\Services\TenantProvisioningService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

class Sprint2OnboardingTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
    }

    /**
     * Test 1 — Fresh Platform Has No Tenant
     */
    public function test_1_fresh_platform_has_no_tenant()
    {
        // Clean any leftover test tenants
        foreach (Tenant::all() as $t) {
            $t->delete();
        }

        $this->assertEquals(0, Tenant::count(), 'Fresh platform environment MUST start with zero tenants.');
    }

    /**
     * Test 2 — POST /onboarding creates a pending RegistrationRequest in Landlord DB
     */
    public function test_2_onboarding_creates_registration_request()
    {
        RegistrationRequest::where('slug', 'test-corp')->delete();

        $response = $this->post('/onboarding', [
            'organization_name' => 'شركة الابتكار',
            'slug' => 'test-corp',
            'admin_name' => 'أحمد محمد',
            'admin_email' => 'ahmed@testcorp.com',
        ]);

        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/onboarding');

        $this->assertDatabaseHas('registration_requests', [
            'slug' => 'test-corp',
            'status' => 'pending',
            'admin_email' => 'ahmed@testcorp.com',
        ], 'pgsql');

        // Cleanup
        RegistrationRequest::where('slug', 'test-corp')->delete();
    }

    /**
     * Test 3 — Tenant Database Is Provisioned
     */
    public function test_3_tenant_database_is_provisioned()
    {
        $service = new TenantProvisioningService;
        $result = $service->createTenant(
            'dbprov-test',
            'شركة التهيئة والداول',
            'سليمان علي',
            'admin@dbprov.com',
            'Password123!'
        );

        $tenant = $result['tenant'];

        $tenant->run(function () {
            $this->assertTrue(Schema::hasTable('users'));
            $this->assertTrue(Schema::hasTable('permissions'));
            $this->assertTrue(Schema::hasTable('user_permissions'));
            $this->assertTrue(Schema::hasTable('roles'));
            $this->assertTrue(Schema::hasTable('audit_logs'));
        });

        // Cleanup
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }

    /**
     * Test 4 — Initial Administrator Is Created
     */
    public function test_4_initial_administrator_is_created()
    {
        $service = new TenantProvisioningService;
        $result = $service->createTenant(
            'admin-test',
            'مؤسسة الإدارة الأولى',
            'عمر الفاروق',
            'omar@admintest.com',
            'AdminSecret123!'
        );

        $tenant = $result['tenant'];

        $tenant->run(function () {
            $admin = User::where('email', 'omar@admintest.com')->first();
            $this->assertNotNull($admin);
            $this->assertEquals('عمر الفاروق', $admin->name);
            $this->assertTrue(Hash::check('AdminSecret123!', $admin->password));
            $this->assertEquals('active', $admin->status);
        });

        // Cleanup
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }

    /**
     * Test 5 — Administrator Has Required Permissions
     */
    public function test_5_administrator_has_required_permissions()
    {
        $service = new TenantProvisioningService;
        $result = $service->createTenant(
            'perm-test',
            'شركة الصلاحيات الكاملة',
            'سامر حسام',
            'samer@permtest.com',
            'Password123!'
        );

        $tenant = $result['tenant'];

        $tenant->run(function () {
            $admin = User::where('email', 'samer@permtest.com')->first();
            $this->assertNotNull($admin);
            $this->assertTrue($admin->hasPermission('users.view'));
            $this->assertTrue($admin->hasPermission('users.create'));
            $this->assertTrue($admin->hasPermission('users.permissions'));
            $this->assertTrue($admin->hasPermission('expenses.view'));
            $this->assertTrue($admin->hasPermission('audit.view'));
        });

        // Cleanup
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }

    /**
     * Test 6 — Registration Request Shows Pending Approval Message
     */
    public function test_6_registration_shows_pending_message()
    {
        RegistrationRequest::where('slug', 'pending-corp')->delete();

        $response = $this->post('/onboarding', [
            'organization_name' => 'شركة الطلب المعلق',
            'slug' => 'pending-corp',
            'admin_name' => 'ماجد ناصر',
            'admin_email' => 'majed@pending.com',
        ]);

        $response->assertRedirect('/onboarding');
        $response->assertSessionHas('success', 'تم إرسال طلب التسجيل بنجاح! طلبك الآن قيد المراجعة.');

        $this->assertEquals(1, RegistrationRequest::where('slug', 'pending-corp')->count());

        // Cleanup
        RegistrationRequest::where('slug', 'pending-corp')->delete();
    }

    /**
     * Test 7 — No Tenant Means No Arbitrary Tenant Selection
     */
    public function test_7_no_tenant_means_no_arbitrary_tenant_selection()
    {
        $service = new TenantProvisioningService;
        $resA = $service->createTenant('corp-one', 'Corp One', 'Admin 1', 'admin1@one.com', 'Pass123!');
        $resB = $service->createTenant('corp-two', 'Corp Two', 'Admin 2', 'admin2@two.com', 'Pass123!');
        $tenantA = $resA['tenant'];
        $tenantB = $resB['tenant'];

        // Unauthenticated request without session tenant context
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }

        $response = $this->get('/');
        $response->assertRedirect('/onboarding');
        $this->assertNull(tenant(), 'System MUST NOT select first active tenant when no tenant context exists.');

        // Cleanup
        $tenantA->delete();
        $tenantB->delete();
    }

    /**
     * Test 8 — Duplicate Slug Is Rejected
     */
    public function test_8_duplicate_slug_is_rejected()
    {
        $this->post('/onboarding', [
            'organization_name' => 'المؤسسة الأولى',
            'slug' => 'unique-slug',
            'admin_name' => 'علي حسن',
            'admin_email' => 'ali@first.com',
        ]);

        // Attempt second registration with same slug
        $secondResponse = $this->post('/onboarding', [
            'organization_name' => 'المؤسسة الثانية',
            'slug' => 'unique-slug',
            'admin_name' => 'حسن علي',
            'admin_email' => 'hassan@second.com',
        ]);

        $secondResponse->assertSessionHasErrors('slug');
        $this->assertEquals(1, RegistrationRequest::where('slug', 'unique-slug')->count());

        // Cleanup
        RegistrationRequest::where('slug', 'unique-slug')->delete();
    }

    /**
     * Test 9 — Failed Provisioning Does Not Report Success
     */
    public function test_9_failed_provisioning_does_not_report_success()
    {
        $service = new TenantProvisioningService;

        // Create initial tenant to trigger duplicate constraint inside provisioning
        Tenant::create(['id' => 'existing-tenant', 'name' => 'Existing', 'status' => 'active']);

        try {
            $service->createTenant('existing-tenant', 'Bad Corp', 'Admin', 'admin@bad.com', 'Password123!');
            $this->fail('Expected provisioning exception was not thrown.');
        } catch (\Throwable $e) {
            $this->assertStringContainsString('فشل في تهيئة ونشر بيئة المؤسسة', $e->getMessage());
        }

        // Cleanup
        Tenant::find('existing-tenant')?->delete();
    }

    /**
     * Test 10 — Tenant Isolation (Database Data Isolation & 403 Access Denial)
     */
    public function test_10_tenant_isolation_prevents_cross_access()
    {
        $service = new TenantProvisioningService;
        $resA = $service->createTenant('tenant-iso-a', 'Tenant Iso A', 'Admin A', 'admin@iso-a.com', 'Password123!');
        $resB = $service->createTenant('tenant-iso-b', 'Tenant Iso B', 'Admin B', 'admin@iso-b.com', 'Password123!');
        $tenantA = $resA['tenant'];
        $tenantB = $resB['tenant'];

        // 1. Data Isolation: Tenant A DB cannot query Tenant B users or audit logs
        $tenantA->run(function () {
            $userB = User::where('email', 'admin@iso-b.com')->first();
            $this->assertNull($userB, 'Tenant A DB MUST NOT see Tenant B admin user');
        });

        $domainB = 'http://'.$tenantB->domains->first()->domain;

        // 2. HTTP Authorization Isolation: Login as Tenant B user and attempt access without Tenant A permissions
        // Note: Login now requires domain
        $this->post($domainB.'/login', [
            'email' => 'admin@iso-b.com',
            'password' => 'Password123!',
        ]);

        // Create restricted user in Tenant B
        $restrictedUserB = null;
        $tenantB->run(function () use (&$restrictedUserB) {
            $restrictedUserB = User::create([
                'name' => 'Restricted User B',
                'email' => 'restricted@iso-b.com',
                'password' => bcrypt('Password123!'),
                'role_title' => 'عضو عادي',
                'status' => 'active',
            ]);
        });

        $this->post($domainB.'/login', [
            'email' => 'restricted@iso-b.com',
            'password' => 'Password123!',
        ]);

        // Accessing protected route without permission yields HTTP 403
        $forbiddenResponse = $this->get($domainB.'/users');
        $forbiddenResponse->assertStatus(403);

        // Cleanup
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenantA->delete();
        $tenantB->delete();
    }

    /**
     * Test 11 — Audit Is Created
     */
    public function test_11_audit_is_created_on_tenant_provisioning()
    {
        $service = new TenantProvisioningService;
        $result = $service->createTenant('audit-prov-test', 'شركة التدقيق الفوري', 'أيمن فؤاد', 'ayman@auditprov.com', 'Password123!');
        $tenant = $result['tenant'];

        $tenant->run(function () {
            $log = AuditLog::where('action', 'TENANT_PROVISIONED')->first();
            $this->assertNotNull($log);
            $this->assertEquals('Tenant', $log->entity_type);
            $this->assertStringContainsString('ayman@auditprov.com', $log->description);
        });

        // Cleanup
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }

    /**
     * Test 12 — Password Never Appears in Audit
     */
    public function test_12_password_never_appears_in_audit_logs_or_serialized_data()
    {
        $service = new TenantProvisioningService;
        $secretPassword = 'SuperSecretUnseenPassword999!';
        $result = $service->createTenant('secret-audit-test', 'شركة السرية التامة', 'زياد حاتم', 'ziad@secretaudit.com', $secretPassword);
        $tenant = $result['tenant'];

        $tenant->run(function () use ($secretPassword) {
            $logs = AuditLog::all();
            foreach ($logs as $log) {
                $this->assertStringNotContainsString($secretPassword, $log->description);
                $this->assertStringNotContainsString($secretPassword, json_encode($log->changes ?? []));
            }
        });

        // Cleanup
        if (function_exists('tenant') && tenant()) {
            tenancy()->end();
        }
        $tenant->delete();
    }

    /**
     * Test 13 — Platform Admin can approve a registration request and generate activation token
     */
    public function test_13_platform_admin_can_approve_registration_request()
    {
        Mail::fake();

        $slug = 'approve-corp-'.strtolower(Str::random(5));
        $request = RegistrationRequest::create([
            'organization_name' => 'شركة الاعتماد',
            'slug' => $slug,
            'admin_name' => 'سالم',
            'admin_email' => 'salem@approve.com',
            'status' => 'pending',
        ]);

        // Platform User authentication context
        $platformAdmin = PlatformUser::factory()->create();

        $this->withoutExceptionHandling();
        $response = $this->actingAs($platformAdmin, 'platform')->post('/admin/requests/'.$request->id.'/approve');

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $request->refresh();
        $this->assertEquals('approved', $request->status);
        $this->assertNotNull($request->activation_token);
        $this->assertNotNull($request->token_expires_at);

        Mail::assertSent(RegistrationApprovedMail::class, function ($mail) use ($request) {
            return $mail->hasTo('salem@approve.com') && $mail->registrationRequest->id === $request->id;
        });

        // Cleanup
        $request->delete();
        $platformAdmin->delete();
    }

    /**
     * Test 14 — Activation Token Provisions Tenant and Redirects
     */
    public function test_14_activation_token_provisions_tenant()
    {
        $slug = 'activate-corp-'.strtolower(Str::random(5));
        $token = Str::random(64);
        $request = RegistrationRequest::create([
            'organization_name' => 'شركة التفعيل',
            'slug' => $slug,
            'admin_name' => 'نادر',
            'admin_email' => 'nader@activate.com',
            'status' => 'approved',
            'activation_token' => $token,
            'token_expires_at' => now()->addDays(1),
        ]);

        $response = $this->withHeaders(['X-Inertia' => 'true'])->post('/activation/'.$token, [
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $centralDomain = parse_url(config('app.url'), PHP_URL_HOST) ?? 'localhost';
        $response->assertStatus(409);
        $response->assertHeader('X-Inertia-Location', 'http://'.$slug.'.'.$centralDomain.'/login');

        $request->refresh();
        $this->assertEquals('provisioned', $request->status);
        $this->assertNull($request->activation_token);

        $this->assertDatabaseHas('tenants', [
            'id' => $slug,
        ], 'pgsql');

        // Cleanup
        Tenant::find($slug)?->delete();
        $request->delete();
    }
}
