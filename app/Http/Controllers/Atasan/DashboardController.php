<?php

namespace App\Http\Controllers\Atasan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKeuangan;
use App\Models\PerintahPerjalanan;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_perintah'        => PerintahPerjalanan::count(),
            'perintah_selesai'      => PerintahPerjalanan::where('status', 'selesai')->count(),
            'laporan_pending'       => LaporanKeuangan::where('status_verifikasi', 'pending')->count(),
            'laporan_diverifikasi'  => LaporanKeuangan::where('status_verifikasi', 'diverifikasi')->count(),
            'total_harga'           => PerintahPerjalanan::where('status', 'selesai')->sum('harga'),
            'total_biaya_transport' => LaporanKeuangan::sum('total_biaya_transport'),
        ];
        $stats['total_orderan'] = $stats['total_harga'] - $stats['total_biaya_transport'];

        // Laporan terbaru menunggu verifikasi
        $menungguVerif = LaporanKeuangan::with(['perintah.kendaraan', 'perintah.driver'])
            ->where('status_verifikasi', 'pending')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn ($l) => [
                'id'             => $l->id,
                'nomor_perintah' => $l->perintah->nomor_perintah,
                'nopol'          => $l->perintah->kendaraan->nopol,
                'driver'         => $l->perintah->driver->name,
                'tujuan'         => $l->perintah->tujuan,
                'harga'          => $l->perintah->harga,
                'biaya_transport'=> $l->total_biaya_transport,
                'orderan'        => (float)$l->perintah->harga - (float)$l->total_biaya_transport,
                'tanggal'        => $l->tanggal_laporan->format('d/m/Y'),
            ]);

        return Inertia::render('Atasan/Dashboard', compact('stats', 'menungguVerif'));
    }
}
