<?php

namespace Tests\Feature;

use App\Models\PlatformUser;
use Tests\TestCase;

class AuthRedirectRulesTest extends TestCase
{
    public function test_admin_login_alias_redirects_to_login_without_404()
    {
        $response = $this->get('/admin/login');

        $response->assertStatus(302);
        $response->assertRedirect('/login');
    }

    public function test_public_onboarding_route_remains_accessible_for_all_users()
    {
        // Public visitor
        $response = $this->get('/onboarding');
        $response->assertStatus(200);

        // Authenticated Platform Admin can also view /onboarding without forced redirect
        $admin = PlatformUser::factory()->create();
        $responseLoggedIn = $this->actingAs($admin, 'platform')->get('/onboarding');
        $responseLoggedIn->assertStatus(200);
    }

    public function test_authenticated_platform_admin_visiting_login_is_redirected_to_intended_or_dashboard()
    {
        $admin = PlatformUser::factory()->create();

        $response = $this->actingAs($admin, 'platform')->get('/login');

        $response->assertStatus(302);
        $response->assertRedirect('/admin/dashboard');
    }

    public function test_unauthenticated_user_accessing_protected_resource_is_redirected_to_login_then_intended()
    {
        // 1. Access protected route without auth -> redirected to login
        $response = $this->get('/admin/requests');
        $response->assertStatus(302);
        $response->assertRedirect('/login');

        // 2. Perform login -> redirected to intended URL (/admin/requests)
        $admin = PlatformUser::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $loginResponse = $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password123',
        ]);

        $loginResponse->assertRedirect(url('/admin/requests'));
    }

    public function test_landing_page_is_accessible_to_everyone_including_logged_in_platform_admin()
    {
        // Public visitor accessing / and /landing
        $responsePublicRoot = $this->get('/');
        $responsePublicRoot->assertStatus(200);
        $responsePublicRoot->assertInertia(fn ($page) => $page->component('Platform/Landing'));

        $responsePublicLanding = $this->get('/landing');
        $responsePublicLanding->assertStatus(200);
        $responsePublicLanding->assertInertia(fn ($page) => $page->component('Platform/Landing'));

        // Authenticated Platform Admin accessing / and /landing can view Landing page
        $admin = PlatformUser::factory()->create();

        $responseAdminRoot = $this->actingAs($admin, 'platform')->get('/');
        $responseAdminRoot->assertStatus(200);
        $responseAdminRoot->assertInertia(fn ($page) => $page->component('Platform/Landing'));

        $responseAdminLanding = $this->actingAs($admin, 'platform')->get('/landing');
        $responseAdminLanding->assertStatus(200);
        $responseAdminLanding->assertInertia(fn ($page) => $page->component('Platform/Landing'));
    }
}
