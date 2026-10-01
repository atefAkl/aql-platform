<?php

declare(strict_types=1);

namespace App\Http\Controllers\Platform;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    /**
     * Display a listing of Subscription Plans.
     */
    public function index(Request $request): Response
    {
        $plans = Plan::query()
            ->withCount('subscriptions')
            ->latest()
            ->get();

        return Inertia::render('Platform/Plans/Index', [
            'plans' => $plans,
        ]);
    }

    /**
     * Store a newly created Subscription Plan.
     */
    public function store(Request $request, NotificationService $notificationService)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
        ], [
            'name.required' => 'يرجى إدخال اسم خطة الاشتراك.',
            'price.required' => 'يرجى إدخال سعر خطة الاشتراك.',
            'price.numeric' => 'يجب أن يكون السعر رقماً صحيحاً أو عشرياً.',
            'price.min' => 'لا يمكن أن يكون السعر بالسالب.',
        ]);

        Plan::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'status' => 'active',
        ]);

        $notificationService->success('تم إنشاء خطة الاشتراك بنجاح.');

        return redirect()->route('platform.plans.index');
    }

    /**
     * Update the specified Subscription Plan.
     */
    public function update(Request $request, Plan $plan, NotificationService $notificationService)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price' => ['required', 'numeric', 'min:0'],
            'confirm_price_change' => ['nullable', 'boolean'],
        ], [
            'name.required' => 'يرجى إدخال اسم خطة الاشتراك.',
            'price.required' => 'يرجى إدخال سعر خطة الاشتراك.',
            'price.numeric' => 'يجب أن يكون السعر رقماً صحيحاً أو عشرياً.',
            'price.min' => 'لا يمكن أن يكون السعر بالسالب.',
        ]);

        $nameUnchanged = trim((string) $plan->name) === trim((string) $validated['name']);
        $descUnchanged = trim((string) ($plan->description ?? '')) === trim((string) ($validated['description'] ?? ''));
        $priceUnchanged = abs(((float) $plan->price) - ((float) $validated['price'])) < 0.001;

        // Info Scenario: Submitted without any modifications
        if ($nameUnchanged && $descUnchanged && $priceUnchanged) {
            $notificationService->info('لم يتم إجراء أي تغييرات على الخطة.');

            return back();
        }

        // Warning Scenario: Price is being changed AND plan has active subscriptions AND confirmation not yet given
        $isPriceChanging = ! $priceUnchanged;
        $hasActiveSubscribers = $plan->subscriptions()->count() > 0;
        $isConfirmed = $request->boolean('confirm_price_change');

        if ($isPriceChanging && $hasActiveSubscribers && ! $isConfirmed) {
            $notificationService->warning('تنبيه: تغيير سعر الخطة قد يؤثر على المشتركين الحاليين. هل ترغب في المتابعة؟');

            return back()->with('requires_price_change_confirmation', true);
        }

        // Proceed with update
        $plan->update([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
        ]);

        $notificationService->success('تم تحديث خطة الاشتراك بنجاح.');

        return back();
    }
}
