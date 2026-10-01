<?php

namespace Database\Factories;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlanFactory extends Factory
{
    protected $model = Plan::class;

    public function definition(): array
    {
        return [
            'name' => 'خطة '.fake()->word(),
            'description' => fake()->sentence(),
            'price' => fake()->randomFloat(2, 50, 500),
            'status' => 'active',
        ];
    }
}
