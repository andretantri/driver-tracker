<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DriverController extends Controller
{
    public function index(Request $request)
    {
        $query = User::where('level', 3);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('username', 'like', "%{$request->search}%")
                  ->orWhere('phone', 'like', "%{$request->search}%");
            });
        }

        $drivers = $query->orderBy('name')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Driver/Index', [
            'drivers' => $drivers,
            'filters' => $request->only('search'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username|max:50',
            'name'     => 'required|string|max:100',
            'phone'    => 'nullable|string|max:20',
            'password' => 'required|string|min:6|confirmed',
        ]);

        User::create([
            'username'  => $request->username,
            'name'      => strtoupper($request->name),
            'phone'     => $request->phone,
            'password'  => Hash::make($request->password),
            'level'     => 3,
            'is_active' => true,
        ]);

        return back()->with('success', 'Driver berhasil ditambahkan.');
    }

    public function update(Request $request, User $driver)
    {
        $request->validate([
            'username'  => 'required|string|max:50|unique:users,username,' . $driver->id,
            'name'      => 'required|string|max:100',
            'phone'     => 'nullable|string|max:20',
            'is_active' => 'boolean',
        ]);

        $driver->update([
            'username'  => $request->username,
            'name'      => strtoupper($request->name),
            'phone'     => $request->phone,
            'is_active' => $request->is_active ?? true,
        ]);

        if ($request->password) {
            $request->validate(['password' => 'min:6|confirmed']);
            $driver->update(['password' => Hash::make($request->password)]);
        }

        return back()->with('success', 'Data driver berhasil diperbarui.');
    }

    public function destroy(User $driver)
    {
        if ($driver->perintahSebagaiDriver()->whereIn('status', ['pending', 'diterima', 'berjalan'])->exists()) {
            return back()->with('error', 'Driver masih memiliki perintah aktif.');
        }
        $driver->update(['is_active' => false]);
        return back()->with('success', 'Driver berhasil dinonaktifkan.');
    }
}
