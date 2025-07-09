<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        $users = $query->where('id','!=',1)->latest()->paginate(10);
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users->through(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at ? $user->created_at->toDateTimeString() : null,
                    'suspended_at' => $user->suspended_at ? $user->suspended_at->toDateTimeString() : null,
                ];
            }),
            'filters' => [
                'search' => $request->search ?? '',
                'role' => $request->role ?? '',
            ]
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => [
                ['value' => 'admin', 'label' => 'Administrator'],
                ['value' => 'seller', 'label' => 'Seller'],
                ['value' => 'buyer', 'label' => 'Buyer'],
            ]
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|in:buyer,seller,admin',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', [
            'user' => $user
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => [
                ['value' => 'admin', 'label' => 'Administrator'],
                ['value' => 'seller', 'label' => 'Seller'],
                ['value' => 'buyer', 'label' => 'Buyer'],
            ]
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', Rules\Password::defaults()],
            'role' => 'required|in:buyer,seller,admin',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Suspend the specified user.
     */
    public function suspend(User $user)
    {
        // Prevent suspending yourself
        if ($user->id === auth()->id()) {
            return request()->expectsJson()
                ? response()->json(['message' => 'You cannot suspend your own account.'], 403)
                : back()->with('error', 'You cannot suspend your own account.');
        }

        // Prevent suspending other admins
        if ($user->isAdmin() && !auth()->user()->isAdmin()) {
            return request()->expectsJson()
                ? response()->json(['message' => 'Only administrators can suspend other administrators.'], 403)
                : back()->with('error', 'Only administrators can suspend other administrators.');
        }

        $user->update(['suspended_at' => now()]);

        return request()->expectsJson()
            ? response()->json(['message' => 'User has been suspended successfully.'])
            : back()->with('success', 'User has been suspended successfully.');
    }

    /**
     * Unsuspend the specified user.
     */
    public function unsuspend(User $user)
    {
        // Only admins can unsuspend users
        if (!auth()->user()->isAdmin()) {
            return request()->expectsJson()
                ? response()->json(['message' => 'You do not have permission to unsuspend users.'], 403)
                : back()->with('error', 'You do not have permission to unsuspend users.');
        }

        $user->update(['suspended_at' => null]);

        return request()->expectsJson()
            ? response()->json(['message' => 'User has been unsuspended successfully.'])
            : back()->with('success', 'User has been unsuspended successfully.');
    }
}
