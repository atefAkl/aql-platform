<?php

namespace Tests\Feature;

use Tests\TestCase;

class ChangelogTest extends TestCase
{
    public function test_public_changelog_returns_200_ok()
    {
        $response = $this->get('/changelog');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Platform/Changelog')
            ->has('releases')
            ->has('latestVersion')
        );
    }

    public function test_public_changelog_is_accessible_without_authentication_or_tenant_context()
    {
        $this->assertGuest('web');
        $this->assertGuest('platform');

        $response = $this->get('/changelog');

        $response->assertStatus(200);
        $this->assertFalse(function_exists('tenant') && tenant());
    }

    public function test_only_released_entries_are_visible_publicly()
    {
        $response = $this->get('/changelog');

        $response->assertStatus(200);
        $releases = $response->viewData('page')['props']['releases'];

        $this->assertNotEmpty($releases);
        foreach ($releases as $release) {
            $this->assertEquals('RELEASED', $release['status']);
        }
    }
}
