<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'version',
        'capabilities',
        'dependencies',
        'provisioning_metadata',
        'status',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'dependencies' => 'array',
        'provisioning_metadata' => 'array',
    ];

    public function getConnectionName()
    {
        return config('tenancy.database.central_connection');
    }

    public function subscriptions()
    {
        return $this->hasMany(TenantSubscription::class, 'module_code', 'code');
    }
}
