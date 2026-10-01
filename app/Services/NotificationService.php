<?php

declare(strict_types=1);

namespace App\Services;

class NotificationService
{
    /**
     * Add a success notification.
     */
    public function success(string $message): self
    {
        return $this->add('success', $message);
    }

    /**
     * Add an error notification.
     */
    public function error(string $message): self
    {
        return $this->add('error', $message);
    }

    /**
     * Add a warning notification.
     */
    public function warning(string $message): self
    {
        return $this->add('warning', $message);
    }

    /**
     * Add an info notification.
     */
    public function info(string $message): self
    {
        return $this->add('info', $message);
    }

    /**
     * Add a structured notification to the session.
     */
    public function add(string $type, string $message): self
    {
        $notifications = session()->get('notifications', []);

        $notifications[] = [
            'id' => (string) str()->uuid(),
            'type' => $type,
            'message' => $message,
            'timestamp' => now()->toISOString(),
        ];

        session()->flash('notifications', $notifications);

        // Keep single flash keys synchronized for legacy/simple consumers
        if (in_array($type, ['success', 'error', 'warning', 'info'], true)) {
            session()->flash($type, $message);
        }

        return $this;
    }
}
