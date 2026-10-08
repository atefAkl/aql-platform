<?php

namespace App\Exceptions;

use Exception;

class InvalidModuleManifestException extends Exception
{
    /**
     * @param  array<int, string>  $errors
     */
    public function __construct(
        string $message,
        private array $errors = []
    ) {
        parent::__construct($message);
    }

    /**
     * Get granular validation errors.
     *
     * @return array<int, string>
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
