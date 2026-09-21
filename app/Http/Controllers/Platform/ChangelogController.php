<?php

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChangelogController extends Controller
{
    /**
     * Display the public platform release history / changelog.
     */
    public function index(Request $request)
    {
        $allReleases = config('releases', []);

        // Filter ONLY for RELEASED status for public viewing
        $released = array_values(array_filter($allReleases, function ($release) {
            return isset($release['status']) && $release['status'] === 'RELEASED';
        }));

        return Inertia::render('Platform/Changelog', [
            'releases' => $released,
            'latestVersion' => $released[0]['version'] ?? 'v0.4.0',
        ]);
    }
}
