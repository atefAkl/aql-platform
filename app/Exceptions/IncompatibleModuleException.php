<?php

namespace App\Exceptions;

use Exception;

class IncompatibleModuleException extends Exception
{
    /**
     * @param  array<int, string>  $reasons
     */
    public function __construct(
        string $message,
        private array $reasons = []
    ) {
        parent::__construct($message);
    }

    /**
     * Get compatibility failure reasons.
     *
     * @return array<int, string>
     */
    public function getReasons(): array
    {
        return $this->reasons;
    }
}
