<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use App\Models\LaporanKeuangan;
use App\Models\Notifikasi;
use App\Models\PerintahPerjalanan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_perintah'     => PerintahPerjalanan::count(),
            'perintah_pending'   => PerintahPerjalanan::where('status', 'pending')->count(),
            'perintah_berjalan'  => PerintahPerjalanan::whereIn('status', ['diterima', 'berjalan'])->count(),
            'perintah_selesai'   => PerintahPerjalanan::where('status', 'selesai')->count(),
            'laporan_pending_verif' => LaporanKeuangan::where('status_verifikasi', 'pending')->count(),
            'total_kendaraan'    => Kendaraan::where('status', 'aktif')->count(),
            'total_driver'       => User::where('level', 3)->where('is_active', true)->count(),
        ];

        // Perintah terbaru
        $perintahTerbaru = PerintahPerjalanan::with(['kendaraan', 'driver'])
            ->orderByDesc('created_at')
            ->limit(8)
            ->get()
            ->map(fn ($p) => [
                'id'               => $p->id,
                'nomor_perintah'   => $p->nomor_perintah,
                'nopol'            => $p->kendaraan->nopol,
                'driver'           => $p->driver->name,
                'customer'         => $p->customer,
                'asal'             => $p->asal,
                'tujuan'           => $p->tujuan,
                'tanggal_berangkat'=> $p->tanggal_berangkat->format('d-M-Y'),
                'harga'            => $p->harga,
                'status'           => $p->status,
            ]);

        return Inertia::render('Admin/Dashboard', compact('stats', 'perintahTerbaru'));
    }
}
