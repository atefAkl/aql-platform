<?php

namespace App\Services;

use App\Contracts\ModuleManifestInterface;
use App\Exceptions\IncompatibleModuleException;

class ModuleCompatibilityValidator
{
    public function __construct(
        private ?string $platformVersion = null,
        private ?string $phpVersion = null
    ) {
        if ($platformVersion !== null) {
            $this->platformVersion = $platformVersion;
        } else {
            try {
                $this->platformVersion = function_exists('config') ? (config('app.version') ?? '1.0.0') : '1.0.0';
            } catch (\Throwable) {
                $this->platformVersion = '1.0.0';
            }
        }
        $this->phpVersion = $phpVersion ?? PHP_VERSION;
    }

    /**
     * Check if a validated module manifest is compatible with current Platform Core.
     *
     * @param  ModuleManifestInterface|array<string, mixed>  $manifest
     *
     * @throws IncompatibleModuleException
     */
    public function check(ModuleManifestInterface|array $manifest): bool
    {
        $data = $manifest instanceof ModuleManifestInterface ? $manifest->toArray() : $manifest;
        $reasons = [];

        // 1. Platform Core Version Compatibility Check
        $platformConstraint = $data['compatibility']['platform'] ?? null;
        if ($platformConstraint && ! $this->satisfiesConstraint($this->platformVersion, $platformConstraint)) {
            $reasons[] = "Module requires Platform Core '{$platformConstraint}', but current version is '{$this->platformVersion}'.";
        }

        // 2. PHP Environment Requirements Check
        $phpConstraint = $data['requirements']['php'] ?? null;
        if ($phpConstraint && ! $this->satisfiesConstraint($this->phpVersion, $phpConstraint)) {
            $reasons[] = "Module requires PHP '{$phpConstraint}', but current PHP version is '{$this->phpVersion}'.";
        }

        // 3. PHP Extensions Check (if specified)
        if (isset($data['requirements']['extensions']) && is_array($data['requirements']['extensions'])) {
            foreach ($data['requirements']['extensions'] as $extension) {
                if (! extension_loaded($extension)) {
                    $reasons[] = "Required PHP extension '{$extension}' is not loaded on host environment.";
                }
            }
        }

        if (! empty($reasons)) {
            throw new IncompatibleModuleException(
                'Module compatibility check failed: '.implode(' ', $reasons),
                $reasons
            );
        }

        return true;
    }

    /**
     * Evaluate if a given version satisfies a version constraint.
     */
    public function satisfiesConstraint(string $version, string $constraint): bool
    {
        $constraint = trim($constraint);
        $version = trim($version);

        // Normalize version (extract X.Y.Z)
        if (preg_match('/^(\d+\.\d+\.\d+)/', $version, $matches)) {
            $normalizedVersion = $matches[1];
        } else {
            $normalizedVersion = $version;
        }

        // Parse operator and target version
        if (preg_match('/^(\^|\~|\>=|\>|\<=|\<|\=)?\s*(\d+\.\d+(?:\.\d+)?)/', $constraint, $matches)) {
            $operator = $matches[1] ?: '=';
            $targetVersion = $matches[2];

            // Pad targetVersion if 2 digits (e.g. 11.0 -> 11.0.0)
            if (substr_count($targetVersion, '.') === 1) {
                $targetVersion .= '.0';
            }

            return match ($operator) {
                '^' => $this->satisfiesCaretConstraint($normalizedVersion, $targetVersion),
                '~' => $this->satisfiesTildeConstraint($normalizedVersion, $targetVersion),
                '>=' => version_compare($normalizedVersion, $targetVersion, '>='),
                '>' => version_compare($normalizedVersion, $targetVersion, '>'),
                '<=' => version_compare($normalizedVersion, $targetVersion, '<='),
                '<' => version_compare($normalizedVersion, $targetVersion, '<'),
                '=' => version_compare($normalizedVersion, $targetVersion, '='),
                default => false,
            };
        }

        return version_compare($normalizedVersion, $constraint, '=');
    }

    private function satisfiesCaretConstraint(string $version, string $target): bool
    {
        // Caret constraint (e.g. ^1.0.0 allows >= 1.0.0 and < 2.0.0)
        $targetParts = explode('.', $target);
        $major = (int) ($targetParts[0] ?? 0);

        if (version_compare($version, $target, '<')) {
            return false;
        }

        $nextMajor = ($major + 1).'.0.0';

        return version_compare($version, $nextMajor, '<');
    }

    private function satisfiesTildeConstraint(string $version, string $target): bool
    {
        // Tilde constraint (e.g. ~1.0.0 allows >= 1.0.0 and < 1.1.0)
        $targetParts = explode('.', $target);
        $major = (int) ($targetParts[0] ?? 0);
        $minor = (int) ($targetParts[1] ?? 0);

        if (version_compare($version, $target, '<')) {
            return false;
        }

        $nextMinor = $major.'.'.($minor + 1).'.0';

        return version_compare($version, $nextMinor, '<');
    }
}
