<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'role_title',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    /**
     * Check if user has permission directly OR via their Role template (ADR-003, ADR-005, Contract Section 13).
     */
    public function hasPermission(string $code): bool
    {
        return $this->hasDirectPermission($code);
    }

    /**
     * Check direct or role permission.
     */
    public function hasDirectPermission(string $code): bool
    {
        // 1. Direct User Permission check
        if ($this->permissions()->where('code', $code)->exists()) {
            return true;
        }

        // 2. Role Permission check
        if ($this->role_id && $this->role) {
            return $this->role->permissions()->where('code', $code)->exists();
        }

        return false;
    }
}
