<?php

namespace App\Http\Controllers\Atasan;

use App\Http\Controllers\Controller;
use App\Models\LaporanKeuangan;
use App\Models\Notifikasi;
use App\Models\PerintahPerjalanan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VerifikasiController extends Controller
{
    public function index(Request $request)
    {
        $query = LaporanKeuangan::with(['perintah.kendaraan', 'perintah.driver', 'verifikator']);

        if ($request->status_verifikasi) {
            $query->where('status_verifikasi', $request->status_verifikasi);
        } else {
            $query->where('status_verifikasi', 'pending'); // default tampil pending
        }

        if ($request->nopol) {
            $query->whereHas('perintah.kendaraan', fn ($q) => $q->where('nopol', $request->nopol));
        }

        if ($request->driver_id) {
            $query->whereHas('perintah', fn ($q) => $q->where('driver_id', $request->driver_id));
        }

        if ($request->bulan) {
            $query->whereMonth('tanggal_laporan', date('m', strtotime($request->bulan)))
                  ->whereYear('tanggal_laporan', date('Y', strtotime($request->bulan)));
        }

        $laporan = $query->orderByDesc('created_at')->paginate(15)->withQueryString();

        $laporan->getCollection()->transform(fn ($l) => [
            'id'                => $l->id,
            'tanggal'           => $l->perintah->tanggal_berangkat->format('d-M'),
            'nopol'             => $l->perintah->kendaraan->nopol,
            'driver'            => $l->perintah->driver->name,
            'customer'          => $l->perintah->customer,
            'asal'              => $l->perintah->asal,
            'tujuan'            => $l->perintah->tujuan,
            'harga'             => $l->perintah->harga,
            'biaya_transport'   => $l->total_biaya_transport,
            'orderan'           => (float)$l->perintah->harga - (float)$l->total_biaya_transport,
            'nomor_perintah'    => $l->perintah->nomor_perintah,
            'status_verifikasi' => $l->status_verifikasi,
            'catatan_atasan'    => $l->catatan_atasan,
            'tanggal_verifikasi'=> $l->tanggal_verifikasi?->format('d/m/Y'),
            'verifikator'       => $l->verifikator?->name,
        ]);

        $drivers = User::where('level', 3)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Atasan/Verifikasi/Index', [
            'laporan'    => $laporan,
            'driverList' => $drivers,
            'filters'    => $request->only(['status_verifikasi', 'nopol', 'driver_id', 'bulan']),
        ]);
    }

    public function show(LaporanKeuangan $laporan)
    {
        $laporan->load(['perintah.kendaraan', 'perintah.driver', 'laporanPerjalanan', 'verifikator']);

        return Inertia::render('Atasan/Verifikasi/Detail', [
            'laporan' => [
                'id'                    => $laporan->id,
                'nomor_perintah'        => $laporan->perintah->nomor_perintah,
                'tanggal_laporan'       => $laporan->tanggal_laporan->format('d/m/Y'),
                'tanggal_berangkat'     => $laporan->perintah->tanggal_berangkat->format('d/m/Y'),
                'nopol'                 => $laporan->perintah->kendaraan->nopol,
                'merk_kendaraan'        => $laporan->perintah->kendaraan->merk . ' ' . $laporan->perintah->kendaraan->tipe,
                'driver'                => $laporan->perintah->driver->name,
                'customer'              => $laporan->perintah->customer,
                'asal'                  => $laporan->perintah->asal,
                'tujuan'                => $laporan->perintah->tujuan,
                'harga'                 => $laporan->perintah->harga,
                'biaya_bbm'             => $laporan->biaya_bbm,
                'biaya_tol'             => $laporan->biaya_tol,
                'biaya_parkir'          => $laporan->biaya_parkir,
                'biaya_lain'            => $laporan->biaya_lain,
                'total_biaya_transport' => $laporan->total_biaya_transport,
                'orderan'               => (float)$laporan->perintah->harga - (float)$laporan->total_biaya_transport,
                'keterangan_biaya'      => $laporan->keterangan_biaya,
                'bukti_transfer'        => $laporan->bukti_transfer,
                'status_verifikasi'     => $laporan->status_verifikasi,
                'catatan_atasan'        => $laporan->catatan_atasan,
                'tanggal_verifikasi'    => $laporan->tanggal_verifikasi?->format('d/m/Y H:i'),
                'verifikator'           => $laporan->verifikator?->name,
                'bukti_perjalanan'      => $laporan->laporanPerjalanan?->bukti_perjalanan ?? [],
            ],
        ]);
    }

    public function verifikasi(Request $request, LaporanKeuangan $laporan)
    {
        $request->validate([
            'aksi'    => 'required|in:diverifikasi,ditolak',
            'catatan' => 'nullable|string|max:500',
        ]);

        $laporan->update([
            'status_verifikasi'  => $request->aksi,
            'catatan_atasan'     => $request->catatan,
            'diverifikasi_oleh'  => Auth::id(),
            'tanggal_verifikasi' => now(),
        ]);

        $perintah = $laporan->perintah;

        // Notifikasi ke Admin
        $admins = User::where('level', 2)->get();
        foreach ($admins as $admin) {
            Notifikasi::kirim(
                $admin->id,
                $request->aksi === 'diverifikasi' ? 'Laporan Diverifikasi' : 'Laporan Ditolak',
                "Laporan {$perintah->nomor_perintah} telah " . ($request->aksi === 'diverifikasi' ? 'diverifikasi' : 'ditolak') . " oleh " . Auth::user()->name . ".",
                'verifikasi',
                $laporan->id
            );
        }

        $msg = $request->aksi === 'diverifikasi' ? 'Laporan berhasil diverifikasi.' : 'Laporan telah ditolak.';
        return back()->with('success', $msg);
    }

    public function laporan(Request $request)
    {
        $query = LaporanKeuangan::with(['perintah.kendaraan', 'perintah.driver'])
            ->where('status_verifikasi', 'diverifikasi');

        if ($request->nopol) {
            $query->whereHas('perintah.kendaraan', fn ($q) => $q->where('nopol', $request->nopol));
        }
        if ($request->driver_id) {
            $query->whereHas('perintah', fn ($q) => $q->where('driver_id', $request->driver_id));
        }
        if ($request->bulan) {
            $query->whereMonth('tanggal_laporan', date('m', strtotime($request->bulan)))
                  ->whereYear('tanggal_laporan', date('Y', strtotime($request->bulan)));
        }

        $laporan = $query->orderBy(
            PerintahPerjalanan::select('tanggal_berangkat')
                ->whereColumn('perintah_perjalanan.id', 'laporan_keuangan.perintah_perjalanan_id')
                ->limit(1)
        )->paginate(50)->withQueryString();

        $rows = $laporan->getCollection()->map(fn ($l) => [
            'id'              => $l->id,
            'tanggal'         => $l->perintah->tanggal_berangkat->format('d-M'),
            'nopol'           => $l->perintah->kendaraan->nopol,
            'driver'          => $l->perintah->driver->name,
            'customer'        => $l->perintah->customer,
            'asal'            => $l->perintah->asal,
            'tujuan'          => $l->perintah->tujuan,
            'harga'           => $l->perintah->harga,
            'biaya_transport' => $l->total_biaya_transport,
            'orderan'         => (float)$l->perintah->harga - (float)$l->total_biaya_transport,
        ]);

        // Summary
        $totalHarga  = $rows->sum('harga');
        $totalBiaya  = $rows->sum('biaya_transport');
        $totalOrderan= $rows->sum('orderan');

        $drivers = User::where('level', 3)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Atasan/Laporan/Index', [
            'laporan'    => $laporan->setCollection($rows),
            'driverList' => $drivers,
            'filters'    => $request->only(['nopol', 'driver_id', 'bulan']),
            'summary'    => compact('totalHarga', 'totalBiaya', 'totalOrderan'),
        ]);
    }
}
