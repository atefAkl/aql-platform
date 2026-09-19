<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\RegistrationRequest;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $requests = RegistrationRequest::latest()->get();
        return inertia('Platform/Dashboard', [
            'requests' => $requests,
        ]);
    }
}
