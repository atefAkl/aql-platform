<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TenantSubscription extends Model
{
    protected $fillable = [
        'tenant_id',
        'module_code',
        'status',
        'provisioning_state',
        'starts_at',
        'ends_at',
    ];

    protected $casts = [
        'provisioning_state' => 'array',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];

    public function getConnectionName()
    {
        return config('tenancy.database.central_connection');
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class, 'module_code', 'code');
    }
}
