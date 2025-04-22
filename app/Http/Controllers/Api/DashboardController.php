<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserActivity;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DashboardController extends Controller
{
    public function stats()
    {
        $now = Carbon::now();
        $startOfDay = $now->copy()->startOfDay();
        $startOfWeek = $now->copy()->startOfWeek();

        return response()->json([
            'total_users' => User::count(),
            'active_users' => User::where('last_login_at', '>=', $now->subDays(7))->count(),
            'new_users_today' => User::where('created_at', '>=', $startOfDay)->count(),
            'new_users_this_week' => User::where('created_at', '>=', $startOfWeek)->count(),
        ]);
    }

    public function recentUsers()
    {
        $users = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'created_at']);

        return response()->json($users);
    }

    public function userActivity()
    {
        try {
            if (!Schema::hasTable('user_activities')) {
                Log::error('user_activities table does not exist');
                return response()->json([
                    'error' => 'Activity tracking is not set up properly'
                ], 500);
            }

            $activities = DB::table('user_activities')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();

            if ($activities->isEmpty()) {
                Log::info('No activities found in the database');
                return response()->json([]);
            }

            Log::info('Found ' . $activities->count() . ' activities');

            return response()->json($activities);
        } catch (\Exception $e) {
            Log::error('Error in userActivity: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json([
                'error' => 'Could not fetch user activities',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
