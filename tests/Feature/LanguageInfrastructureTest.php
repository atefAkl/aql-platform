<?php

namespace Tests\Feature;

use Tests\TestCase;

class LanguageInfrastructureTest extends TestCase
{
    public function test_it_has_arabic_as_default_locale_and_renders_html_tag()
    {
        $response = $this->get('/');
        $this->assertEquals('ar', app()->getLocale());

        // Assert the exact rendered root HTML tag matches expected output
        $response->assertSee('<html lang="ar" dir="rtl">', false);
    }

    public function test_user_can_switch_language_and_it_is_persisted_in_session()
    {
        $response = $this->post(route('locale.update'), [
            'locale' => 'en',
        ]);

        $response->assertSessionHas('locale', 'en');
        $response->assertCookie('platform_locale', 'en');

        // Follow up request - full page load should render correct HTML tag
        $this->withSession(['locale' => 'en'])
            ->get('/')
            ->assertSee('<html lang="en" dir="ltr">', false);
    }

    public function test_invalid_locale_is_rejected()
    {
        $response = $this->post(route('locale.update'), [
            'locale' => 'fr', // not supported
        ]);

        $response->assertSessionHasErrors('locale');
    }
}
