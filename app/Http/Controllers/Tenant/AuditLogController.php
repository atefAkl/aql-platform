<?php

declare(strict_types=1);

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    /**
     * Display a listing of selective audit logs for security-sensitive and business operations.
     */
    public function index(): Response
    {
        $auditLogs = AuditLog::orderBy('id', 'desc')->paginate(20);

        return Inertia::render('Audit/Index', [
            'auditLogs' => $auditLogs,
        ]);
    }
}
