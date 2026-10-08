<?php

namespace Tests\Unit;

use App\DTOs\ModuleManifest;
use App\Exceptions\IncompatibleModuleException;
use App\Services\ModuleCompatibilityValidator;
use PHPUnit\Framework\TestCase;

class ModuleCompatibilityValidatorTest extends TestCase
{
    public function test_compatible_module_passes_check(): void
    {
        $validator = new ModuleCompatibilityValidator(
            platformVersion: '1.0.0',
            phpVersion: '8.3.0'
        );

        $manifest = ModuleManifest::fromArray([
            'id' => 'expenses',
            'name' => 'Expenses Management Module',
            'version' => '1.0.0',
            'description' => 'Expenses tracking module.',
            'compatibility' => ['platform' => '^1.0.0'],
            'requirements' => ['php' => '^8.3', 'laravel' => '^11.0'],
        ]);

        $this->assertTrue($validator->check($manifest));
    }

    public function test_incompatible_platform_version_throws_exception(): void
    {
        $validator = new ModuleCompatibilityValidator(
            platformVersion: '1.0.0',
            phpVersion: '8.3.0'
        );

        $manifest = ModuleManifest::fromArray([
            'id' => 'expenses',
            'name' => 'Expenses',
            'version' => '1.0.0',
            'description' => 'Test',
            'compatibility' => ['platform' => '^2.0.0'], // Platform is 1.0.0, manifest requires ^2.0.0
            'requirements' => ['php' => '^8.3', 'laravel' => '^11.0'],
        ]);

        $this->expectException(IncompatibleModuleException::class);
        $validator->check($manifest);
    }

    public function test_incompatible_php_version_throws_exception(): void
    {
        $validator = new ModuleCompatibilityValidator(
            platformVersion: '1.0.0',
            phpVersion: '8.1.0' // Current PHP is 8.1.0
        );

        $manifest = ModuleManifest::fromArray([
            'id' => 'expenses',
            'name' => 'Expenses',
            'version' => '1.0.0',
            'description' => 'Test',
            'compatibility' => ['platform' => '^1.0.0'],
            'requirements' => ['php' => '^8.3', 'laravel' => '^11.0'], // Requires ^8.3
        ]);

        $this->expectException(IncompatibleModuleException::class);
        $validator->check($manifest);
    }

    public function test_caret_and_tilde_constraint_satisfaction(): void
    {
        $validator = new ModuleCompatibilityValidator;

        $this->assertTrue($validator->satisfiesConstraint('1.2.3', '^1.0.0'));
        $this->assertFalse($validator->satisfiesConstraint('2.0.0', '^1.0.0'));

        $this->assertTrue($validator->satisfiesConstraint('1.0.5', '~1.0.0'));
        $this->assertFalse($validator->satisfiesConstraint('1.1.0', '~1.0.0'));
    }
}
