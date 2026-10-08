<?php

namespace App\DTOs;

use App\Contracts\ModuleManifestInterface;
use InvalidArgumentException;

readonly class ModuleManifest implements ModuleManifestInterface
{
    /**
     * @param  array{platform: string}  $compatibility
     * @param  array{php: string, laravel: string, extensions?: array<string>}  $requirements
     * @param  array<string, string>  $dependencies
     */
    public function __construct(
        private string $id,
        private string $name,
        private string $version,
        private string $description,
        private array $compatibility,
        private array $requirements,
        private array $dependencies = []
    ) {}

    /**
     * Instantiate ModuleManifest from a raw array.
     *
     * @param  array<string, mixed>  $data
     */
    public static function fromArray(array $data): self
    {
        return new self(
            id: (string) ($data['id'] ?? ''),
            name: (string) ($data['name'] ?? ''),
            version: (string) ($data['version'] ?? ''),
            description: (string) ($data['description'] ?? ''),
            compatibility: (array) ($data['compatibility'] ?? []),
            requirements: (array) ($data['requirements'] ?? []),
            dependencies: (array) ($data['dependencies'] ?? [])
        );
    }

    /**
     * Instantiate ModuleManifest from a JSON string.
     */
    public static function fromJson(string $json): self
    {
        $decoded = json_decode($json, true);

        if (! is_array($decoded)) {
            throw new InvalidArgumentException('Invalid JSON string provided for ModuleManifest.');
        }

        return self::fromArray($decoded);
    }

    /**
     * Instantiate ModuleManifest from a JSON file path.
     */
    public static function fromFile(string $path): self
    {
        if (! file_exists($path) || ! is_readable($path)) {
            throw new InvalidArgumentException("Manifest file not found or unreadable at path: {$path}");
        }

        $content = file_get_contents($path);

        if ($content === false) {
            throw new InvalidArgumentException("Unable to read manifest file content at path: {$path}");
        }

        return self::fromJson($content);
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getVersion(): string
    {
        return $this->version;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getCompatibility(): array
    {
        return $this->compatibility;
    }

    public function getRequirements(): array
    {
        return $this->requirements;
    }

    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'version' => $this->version,
            'description' => $this->description,
            'compatibility' => $this->compatibility,
            'requirements' => $this->requirements,
            'dependencies' => $this->dependencies,
        ];
    }
}
