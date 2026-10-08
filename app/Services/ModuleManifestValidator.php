<?php

namespace App\Services;

use App\Contracts\ModuleManifestInterface;
use App\DTOs\ModuleManifest;
use App\Exceptions\InvalidModuleManifestException;

class ModuleManifestValidator
{
    private const IDENTIFIER_REGEX = '/^[a-z0-9]+(-[a-z0-9]+)*$/';

    private const SEMVER_REGEX = '/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/';

    private const CONSTRAINT_REGEX = '/^(\^|\~|\>=|\>|\<=|\<|\=)?\s*(0|[1-9]\d*)\.(0|[1-9]\d*)(\.(0|[1-9]\d*))?$/';

    /**
     * Validate raw manifest array or ModuleManifest instance.
     *
     * @param  ModuleManifestInterface|array<string, mixed>  $manifest
     *
     * @throws InvalidModuleManifestException
     */
    public function validate(ModuleManifestInterface|array $manifest): bool
    {
        $data = $manifest instanceof ModuleManifestInterface ? $manifest->toArray() : $manifest;
        $errors = [];

        // 1. Mandatory Identity Fields Validation
        if (empty($data['id']) || ! is_string($data['id'])) {
            $errors[] = 'Module "id" is required and must be a string.';
        } elseif (! preg_match(self::IDENTIFIER_REGEX, $data['id'])) {
            $errors[] = 'Module "id" must be in valid kebab-case format (e.g. "expenses" or "expenses-v2").';
        }

        if (empty($data['name']) || ! is_string($data['name'])) {
            $errors[] = 'Module "name" is required and must be a non-empty string.';
        }

        if (empty($data['description']) || ! is_string($data['description'])) {
            $errors[] = 'Module "description" is required and must be a non-empty string.';
        }

        // 2. Version Validation
        if (empty($data['version']) || ! is_string($data['version'])) {
            $errors[] = 'Module "version" is required and must be a string.';
        } elseif (! preg_match(self::SEMVER_REGEX, $data['version'])) {
            $errors[] = 'Module "version" must follow valid Semantic Versioning format (e.g. "1.0.0").';
        }

        // 3. Platform Compatibility Constraint Syntax Validation
        if (empty($data['compatibility']) || ! is_array($data['compatibility'])) {
            $errors[] = 'Module "compatibility" configuration is required and must be an array.';
        } else {
            if (empty($data['compatibility']['platform']) || ! is_string($data['compatibility']['platform'])) {
                $errors[] = 'Module "compatibility.platform" constraint is required and must be a string (e.g. "^1.0.0").';
            } elseif (! preg_match(self::CONSTRAINT_REGEX, trim($data['compatibility']['platform']))) {
                $errors[] = 'Module "compatibility.platform" must be a valid version constraint (e.g. "^1.0.0", "~1.0.0", "1.0.0").';
            }
        }

        // 4. Requirements Constraints Syntax Validation
        if (empty($data['requirements']) || ! is_array($data['requirements'])) {
            $errors[] = 'Module "requirements" configuration is required and must be an array.';
        } else {
            if (empty($data['requirements']['php']) || ! is_string($data['requirements']['php'])) {
                $errors[] = 'Module "requirements.php" version constraint is required and must be a string.';
            } elseif (! preg_match(self::CONSTRAINT_REGEX, trim($data['requirements']['php']))) {
                $errors[] = 'Module "requirements.php" must be a valid version constraint (e.g. "^8.3").';
            }

            if (empty($data['requirements']['laravel']) || ! is_string($data['requirements']['laravel'])) {
                $errors[] = 'Module "requirements.laravel" version constraint is required and must be a string.';
            } elseif (! preg_match(self::CONSTRAINT_REGEX, trim($data['requirements']['laravel']))) {
                $errors[] = 'Module "requirements.laravel" must be a valid version constraint (e.g. "^11.0").';
            }

            if (isset($data['requirements']['extensions'])) {
                if (! is_array($data['requirements']['extensions'])) {
                    $errors[] = 'Module "requirements.extensions" must be an array of strings.';
                } else {
                    foreach ($data['requirements']['extensions'] as $ext) {
                        if (! is_string($ext) || trim($ext) === '') {
                            $errors[] = 'Each entry in "requirements.extensions" must be a non-empty string.';
                            break;
                        }
                    }
                }
            }
        }

        // 5. Dependencies Declaration Syntax Validation
        if (isset($data['dependencies'])) {
            if (! is_array($data['dependencies'])) {
                $errors[] = 'Module "dependencies" must be an associative array mapping module IDs to version constraints.';
            } else {
                foreach ($data['dependencies'] as $depModuleId => $constraint) {
                    if (! is_string($depModuleId) || ! preg_match(self::IDENTIFIER_REGEX, $depModuleId)) {
                        $errors[] = "Dependency module ID '{$depModuleId}' must be a valid kebab-case identifier.";
                    }
                    if (! is_string($constraint) || ! preg_match(self::CONSTRAINT_REGEX, trim($constraint))) {
                        $errors[] = "Dependency constraint for '{$depModuleId}' must be a valid version constraint string.";
                    }
                }
            }
        }

        if (! empty($errors)) {
            throw new InvalidModuleManifestException(
                'Module manifest validation failed: '.implode(' ', $errors),
                $errors
            );
        }

        return true;
    }
}
