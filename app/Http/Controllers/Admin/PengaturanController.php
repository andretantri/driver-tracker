<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PengaturanController extends Controller
{
    public function index()
    {
        $pengaturan = Pengaturan::first();
        if (!$pengaturan) {
            $pengaturan = Pengaturan::create([
                'nama_aplikasi' => 'Sistem Manajemen Keuangan',
                'nama_perusahaan' => 'PT Sukarno Putro Trans',
            ]);
        }
        
        return Inertia::render('Admin/Pengaturan/Index', [
            'pengaturan' => $pengaturan
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'nama_aplikasi' => 'required|string|max:255',
            'nama_perusahaan' => 'required|string|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,svg|max:2048',
            'remove_logo' => 'nullable|boolean',
        ]);

        $pengaturan = Pengaturan::first();

        if ($request->has('remove_logo') && $request->remove_logo) {
            if ($pengaturan->logo) {
                Storage::disk('public')->delete($pengaturan->logo);
            }
            $pengaturan->logo = null;
        } elseif ($request->hasFile('logo')) {
            if ($pengaturan->logo) {
                Storage::disk('public')->delete($pengaturan->logo);
            }
            $path = $request->file('logo')->store('pengaturan', 'public');
            $pengaturan->logo = $path;
        }

        $pengaturan->nama_aplikasi = $request->nama_aplikasi;
        $pengaturan->nama_perusahaan = $request->nama_perusahaan;
        $pengaturan->save();

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }
}
