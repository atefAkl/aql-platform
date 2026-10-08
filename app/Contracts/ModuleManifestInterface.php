<?php

namespace App\Contracts;

interface ModuleManifestInterface
{
    /**
     * Get unique module identifier (kebab-case).
     */
    public function getId(): string;

    /**
     * Get human-readable module name.
     */
    public function getName(): string;

    /**
     * Get semantic version of the module.
     */
    public function getVersion(): string;

    /**
     * Get module description.
     */
    public function getDescription(): string;

    /**
     * Get platform compatibility constraints.
     *
     * @return array{platform: string}
     */
    public function getCompatibility(): array;

    /**
     * Get environment requirements constraints.
     *
     * @return array{php: string, laravel: string, extensions?: array<string>}
     */
    public function getRequirements(): array;

    /**
     * Get module dependency declarations and version constraints.
     *
     * @return array<string, string>
     */
    public function getDependencies(): array;

    /**
     * Convert the manifest to an array representation.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array;
}
