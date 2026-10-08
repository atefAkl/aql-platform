<?php

namespace Tests\Unit;

use App\DTOs\ModuleManifest;
use App\Exceptions\InvalidModuleManifestException;
use App\Services\ModuleManifestValidator;
use PHPUnit\Framework\TestCase;

class ModuleManifestValidatorTest extends TestCase
{
    private ModuleManifestValidator $validator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->validator = new ModuleManifestValidator;
    }

    public function test_valid_manifest_passes_validation(): void
    {
        $manifest = ModuleManifest::fromArray([
            'id' => 'expenses',
            'name' => 'Expenses Management Module',
            'version' => '1.0.0',
            'description' => 'Business expenses tracking and fiscal reporting.',
            'compatibility' => [
                'platform' => '^1.0.0',
            ],
            'requirements' => [
                'php' => '^8.3',
                'laravel' => '^11.0',
                'extensions' => ['pdo', 'json'],
            ],
            'dependencies' => [
                'core-finance' => '^1.0.0',
            ],
        ]);

        $this->assertTrue($this->validator->validate($manifest));
    }

    public function test_missing_mandatory_fields_throws_invalid_manifest_exception(): void
    {
        $this->expectException(InvalidModuleManifestException::class);

        $this->validator->validate([
            'id' => 'expenses',
            // Missing name, version, description, compatibility, requirements
        ]);
    }

    public function test_invalid_kebab_case_id_throws_exception(): void
    {
        $this->expectException(InvalidModuleManifestException::class);

        $this->validator->validate([
            'id' => 'Expenses_Module!',
            'name' => 'Expenses',
            'version' => '1.0.0',
            'description' => 'Invalid ID format test.',
            'compatibility' => ['platform' => '^1.0.0'],
            'requirements' => ['php' => '^8.3', 'laravel' => '^11.0'],
        ]);
    }

    public function test_invalid_semver_format_throws_exception(): void
    {
        $this->expectException(InvalidModuleManifestException::class);

        $this->validator->validate([
            'id' => 'expenses',
            'name' => 'Expenses',
            'version' => '1.0', // Non-standard SemVer
            'description' => 'Invalid version format.',
            'compatibility' => ['platform' => '^1.0.0'],
            'requirements' => ['php' => '^8.3', 'laravel' => '^11.0'],
        ]);
    }

    public function test_invalid_dependencies_declaration_syntax_throws_exception(): void
    {
        $this->expectException(InvalidModuleManifestException::class);

        $this->validator->validate([
            'id' => 'expenses',
            'name' => 'Expenses',
            'version' => '1.0.0',
            'description' => 'Invalid dependencies syntax test.',
            'compatibility' => ['platform' => '^1.0.0'],
            'requirements' => ['php' => '^8.3', 'laravel' => '^11.0'],
            'dependencies' => [
                'INVALID_NAME' => 'invalid-version',
            ],
        ]);
    }
}
