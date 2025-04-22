<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use App\Models\UserActivity;
use App\Http\Resources\UserResource;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $user = User::create($data);

        // Log activity
        UserActivity::create([
            'type' => 'created',
            'description' => "New user {$user->name} was created",
            'user_id' => Auth::id(),
            'target_user_id' => $user->id,
        ]);

        return response(new UserResource($user), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $user->update($data);

        // Log activity
        UserActivity::create([
            'type' => 'updated',
            'description' => "User {$user->name} updated their profile",
            'user_id' => Auth::id(),
            'target_user_id' => $user->id,
        ]);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $userName = $user->name;

        // Log activity before deletion
        UserActivity::create([
            'type' => 'deleted',
            'description' => "User {$userName} was deleted",
            'user_id' => Auth::id(),
            'target_user_id' => null,
        ]);

        $user->delete();
        return response("", 204);
    }
}
