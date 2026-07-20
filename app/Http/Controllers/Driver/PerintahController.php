<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\LaporanPerjalanan;
use App\Models\Notifikasi;
use App\Models\PerintahPerjalanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PerintahController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $perintahAktif = PerintahPerjalanan::with('kendaraan')
            ->where('driver_id', $user->id)
            ->whereIn('status', ['pending', 'diterima', 'berjalan'])
            ->orderByDesc('tanggal_berangkat')
            ->get()
            ->map(fn ($p) => [
                'id'                => $p->id,
                'nomor_perintah'    => $p->nomor_perintah,
                'nopol'             => $p->kendaraan->nopol,
                'merk'              => $p->kendaraan->merk,
                'customer'          => $p->customer,
                'asal'              => $p->asal,
                'tujuan'            => $p->tujuan,
                'tanggal_berangkat' => $p->tanggal_berangkat->format('d/m/Y'),
                'harga'             => $p->harga,
                'keperluan'         => $p->keperluan,
                'catatan_admin'     => $p->catatan_admin,
                'status'            => $p->status,
                'diterima_at'       => $p->diterima_at?->format('d/m/Y H:i'),
            ]);

        $riwayat = PerintahPerjalanan::with(['kendaraan', 'laporanKeuangan'])
            ->where('driver_id', $user->id)
            ->whereIn('status', ['selesai', 'dibatalkan'])
            ->orderByDesc('tanggal_berangkat')
            ->paginate(10);

        $riwayat->getCollection()->transform(fn ($p) => [
            'id'                => $p->id,
            'nomor_perintah'    => $p->nomor_perintah,
            'nopol'             => $p->kendaraan->nopol,
            'customer'          => $p->customer,
            'asal'              => $p->asal,
            'tujuan'            => $p->tujuan,
            'tanggal_berangkat' => $p->tanggal_berangkat->format('d/m/Y'),
            'harga'             => $p->harga,
            'biaya_transport'   => $p->laporanKeuangan ? $p->laporanKeuangan->total_biaya_transport : null,
            'orderan'           => $p->laporanKeuangan ? (float)$p->harga - (float)$p->laporanKeuangan->total_biaya_transport : null,
            'status'            => $p->status,
            'status_verifikasi' => $p->laporanKeuangan?->status_verifikasi,
            'bukti_transfer'    => $p->laporanKeuangan?->bukti_transfer,
        ]);

        return Inertia::render('Driver/Dashboard', compact('perintahAktif', 'riwayat'));
    }

    public function show(PerintahPerjalanan $perintah)
    {
        if ($perintah->driver_id !== Auth::id()) {
            abort(403);
        }

        $perintah->load(['kendaraan', 'laporanPerjalanan', 'laporanKeuangan']);

        return Inertia::render('Driver/Perintah/Detail', [
            'perintah' => [
                'id'                     => $perintah->id,
                'nomor_perintah'         => $perintah->nomor_perintah,
                'nopol'                  => $perintah->kendaraan->nopol,
                'merk'                   => $perintah->kendaraan->merk . ' ' . $perintah->kendaraan->tipe,
                'customer'               => $perintah->customer,
                'asal'                   => $perintah->asal,
                'tujuan'                 => $perintah->tujuan,
                'tanggal_berangkat'      => $perintah->tanggal_berangkat->format('d/m/Y'),
                'tanggal_kembali_rencana'=> $perintah->tanggal_kembali_rencana?->format('d/m/Y'),
                'harga'                  => $perintah->harga,
                'keperluan'              => $perintah->keperluan,
                'catatan_admin'          => $perintah->catatan_admin,
                'status'                 => $perintah->status,
                'diterima_at'            => $perintah->diterima_at?->format('d/m/Y H:i'),
                'laporan_perjalanan'     => $perintah->laporanPerjalanan ? [
                    'id'                      => $perintah->laporanPerjalanan->id,
                    'tanggal_berangkat_aktual' => $perintah->laporanPerjalanan->tanggal_berangkat_aktual?->format('d/m/Y'),
                    'tanggal_kembali_aktual'   => $perintah->laporanPerjalanan->tanggal_kembali_aktual?->format('d/m/Y'),
                    'odometer_awal'            => $perintah->laporanPerjalanan->odometer_awal,
                    'odometer_akhir'           => $perintah->laporanPerjalanan->odometer_akhir,
                    'total_km'                 => $perintah->laporanPerjalanan->total_km,
                    'catatan_driver'           => $perintah->laporanPerjalanan->catatan_driver,
                    'bukti_perjalanan'         => $perintah->laporanPerjalanan->bukti_perjalanan ?? [],
                    'status'                   => $perintah->laporanPerjalanan->status,
                ] : null,
                'bukti_transfer'         => $perintah->laporanKeuangan?->bukti_transfer,
                'status_verifikasi'      => $perintah->laporanKeuangan?->status_verifikasi,
                'catatan_atasan'         => $perintah->laporanKeuangan?->catatan_atasan,
            ],
        ]);
    }

    public function terima(PerintahPerjalanan $perintah)
    {
        if ($perintah->driver_id !== Auth::id() || $perintah->status !== 'pending') {
            return back()->with('error', 'Tidak bisa menerima perintah ini.');
        }

        $perintah->update([
            'status'      => 'diterima',
            'diterima_at' => now(),
        ]);

        return back()->with('success', 'Perintah berhasil diterima. Selamat bertugas!');
    }

    public function inputLaporan(Request $request, PerintahPerjalanan $perintah)
    {
        if ($perintah->driver_id !== Auth::id()) {
            abort(403);
        }
        if (!in_array($perintah->status, ['diterima', 'berjalan'])) {
            return back()->with('error', 'Status perintah tidak valid untuk input laporan.');
        }

        $request->validate([
            'tanggal_berangkat_aktual' => 'nullable|date',
            'tanggal_kembali_aktual'   => 'nullable|date',
            'odometer_awal'            => 'nullable|integer',
            'odometer_akhir'           => 'nullable|integer',
            'catatan_driver'           => 'nullable|string',
            'bukti_perjalanan.*'       => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            'submit_final'             => 'boolean',
        ]);

        // Handle file uploads
        $buktiBaru = [];
        if ($request->hasFile('bukti_perjalanan')) {
            foreach ($request->file('bukti_perjalanan') as $file) {
                $buktiBaru[] = $file->store('bukti-perjalanan', 'public');
            }
        }

        $totalKm = null;
        if ($request->odometer_awal && $request->odometer_akhir) {
            $totalKm = $request->odometer_akhir - $request->odometer_awal;
        }

        $existing = $perintah->laporanPerjalanan;
        $buktiFinal = array_merge($existing?->bukti_perjalanan ?? [], $buktiBaru);

        LaporanPerjalanan::updateOrCreate(
            ['perintah_perjalanan_id' => $perintah->id],
            [
                'driver_id'                => Auth::id(),
                'tanggal_berangkat_aktual' => $request->tanggal_berangkat_aktual,
                'tanggal_kembali_aktual'   => $request->tanggal_kembali_aktual,
                'odometer_awal'            => $request->odometer_awal,
                'odometer_akhir'           => $request->odometer_akhir,
                'total_km'                 => $totalKm,
                'catatan_driver'           => $request->catatan_driver,
                'bukti_perjalanan'         => $buktiFinal,
                'status'                   => $request->submit_final ? 'submitted' : 'draft',
            ]
        );

        if ($request->submit_final) {
            $perintah->update(['status' => 'selesai']);
        }

        return back()->with('success', $request->submit_final
            ? 'Laporan perjalanan berhasil disubmit. Admin akan memproses laporan keuangan.'
            : 'Laporan tersimpan sebagai draft.');
    }
}
