<?php

namespace Tests\Feature;

use App\DTOs\ModuleManifest;
use App\Services\ModuleCompatibilityValidator;
use App\Services\ModuleManifestValidator;
use Aql\Expenses\ExpensesModule;
use Tests\TestCase;

class ExternalModuleManifestIntegrationTest extends TestCase
{
    public function test_external_expenses_module_package_manifest_discovery_and_validation(): void
    {
        $packageManifestPath = base_path('vendor/aql/expenses-module/module.json');

        if (! file_exists($packageManifestPath)) {
            $this->markTestSkipped('External package aql/expenses-module is not installed in current environment.');
        }

        // 1. Assert External Package Manifest File Exists in Vendor Path
        $this->assertFileExists($packageManifestPath);

        // 2. Read Manifest from External Package File
        $manifest = ModuleManifest::fromFile($packageManifestPath);

        $this->assertSame('expenses', $manifest->getId());
        $this->assertSame('Expenses Management Module', $manifest->getName());
        $this->assertSame('1.0.0', $manifest->getVersion());
        $this->assertSame('^1.0.0', $manifest->getCompatibility()['platform']);
        $this->assertSame('^8.3', $manifest->getRequirements()['php']);

        // 3. Validate Manifest Discovery & Schema via ModuleManifestValidator
        $manifestValidator = new ModuleManifestValidator;
        $this->assertTrue($manifestValidator->validate($manifest));

        // 4. Validate Compatibility via ModuleCompatibilityValidator
        $compatibilityValidator = new ModuleCompatibilityValidator(
            platformVersion: '1.0.0',
            phpVersion: '8.3.0'
        );
        $this->assertTrue($compatibilityValidator->check($manifest));

        // 5. Assert External Package Autoloading Works
        $this->assertTrue(class_exists(ExpensesModule::class));
        $this->assertSame('expenses', ExpensesModule::getModuleCode());
    }

    public function test_core_has_zero_embedded_module_source_code(): void
    {
        // Assert Zero Module Source Code Leakage into Core App Directory
        $this->assertDirectoryDoesNotExist(app_path('Expenses'));
        $this->assertDirectoryDoesNotExist(app_path('Modules'));
        $this->assertFileDoesNotExist(app_path('Http/Controllers/ExpensesController.php'));
        $this->assertFileDoesNotExist(app_path('Models/Expenses.php'));
    }
}
