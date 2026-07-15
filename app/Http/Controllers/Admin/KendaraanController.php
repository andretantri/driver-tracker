<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KendaraanController extends Controller
{
    public function index(Request $request)
    {
        $query = Kendaraan::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nopol', 'like', "%{$request->search}%")
                  ->orWhere('merk', 'like', "%{$request->search}%")
                  ->orWhere('tipe', 'like', "%{$request->search}%");
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $kendaraan = $query->orderBy('nopol')->paginate(15)->withQueryString();

        return Inertia::render('Admin/Kendaraan/Index', [
            'kendaraan' => $kendaraan,
            'filters'   => $request->only(['search', 'status']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nopol'      => 'required|string|max:20|unique:kendaraan,nopol',
            'merk'       => 'required|string|max:50',
            'tipe'       => 'nullable|string|max:50',
            'tahun'      => 'nullable|digits:4|integer',
            'status'     => 'in:aktif,nonaktif',
            'keterangan' => 'nullable|string',
        ]);

        Kendaraan::create([
            'nopol'      => strtoupper($request->nopol),
            'merk'       => $request->merk,
            'tipe'       => $request->tipe,
            'tahun'      => $request->tahun,
            'status'     => $request->status ?? 'aktif',
            'keterangan' => $request->keterangan,
        ]);

        return back()->with('success', 'Kendaraan berhasil ditambahkan.');
    }

    public function update(Request $request, Kendaraan $kendaraan)
    {
        $request->validate([
            'nopol'      => 'required|string|max:20|unique:kendaraan,nopol,' . $kendaraan->id,
            'merk'       => 'required|string|max:50',
            'tipe'       => 'nullable|string|max:50',
            'tahun'      => 'nullable|digits:4|integer',
            'status'     => 'in:aktif,nonaktif',
            'keterangan' => 'nullable|string',
        ]);

        $kendaraan->update([
            'nopol'      => strtoupper($request->nopol),
            'merk'       => $request->merk,
            'tipe'       => $request->tipe,
            'tahun'      => $request->tahun,
            'status'     => $request->status,
            'keterangan' => $request->keterangan,
        ]);

        return back()->with('success', 'Data kendaraan berhasil diperbarui.');
    }

    public function destroy(Kendaraan $kendaraan)
    {
        if ($kendaraan->perintahAktif()->exists()) {
            return back()->with('error', 'Kendaraan sedang digunakan dalam perjalanan aktif.');
        }
        $kendaraan->delete();
        return back()->with('success', 'Kendaraan berhasil dihapus.');
    }
}
