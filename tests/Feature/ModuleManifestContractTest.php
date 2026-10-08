<?php

namespace Tests\Feature;

use App\DTOs\ModuleManifest;
use App\Services\ModuleCompatibilityValidator;
use App\Services\ModuleManifestValidator;
use Tests\TestCase;

class ModuleManifestContractTest extends TestCase
{
    public function test_expenses_module_manifest_json_file_validation_and_compatibility(): void
    {
        $json = <<<'JSON'
        {
            "id": "expenses",
            "name": "Expenses Management Module",
            "version": "1.0.0",
            "description": "إدارة المصروفات التشغيلية للمنشأة والتقارير المالية.",
            "compatibility": {
                "platform": "^1.0.0"
            },
            "requirements": {
                "php": "^8.3",
                "laravel": "^11.0",
                "extensions": [
                    "pdo",
                    "json"
                ]
            },
            "dependencies": {
                "core-finance": "^1.0.0"
            }
        }
        JSON;

        $manifest = ModuleManifest::fromJson($json);

        $this->assertSame('expenses', $manifest->getId());
        $this->assertSame('Expenses Management Module', $manifest->getName());
        $this->assertSame('1.0.0', $manifest->getVersion());
        $this->assertSame('^1.0.0', $manifest->getCompatibility()['platform']);
        $this->assertSame('^8.3', $manifest->getRequirements()['php']);
        $this->assertSame('^1.0.0', $manifest->getDependencies()['core-finance']);

        $validator = new ModuleManifestValidator;
        $this->assertTrue($validator->validate($manifest));

        $compatibilityValidator = new ModuleCompatibilityValidator(
            platformVersion: '1.0.0',
            phpVersion: '8.3.0'
        );
        $this->assertTrue($compatibilityValidator->check($manifest));
    }
}
