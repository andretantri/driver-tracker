<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LaporanKeuangan;
use App\Models\Notifikasi;
use App\Models\PerintahPerjalanan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LaporanKeuanganExport;

class LaporanKeuanganController extends Controller
{
    public function index(Request $request)
    {
        $query = LaporanKeuangan::with([
            'perintah.kendaraan',
            'perintah.driver',
            'verifikator',
        ]);

        if ($request->search) {
            $query->whereHas('perintah', function ($q) use ($request) {
                $q->where('nomor_perintah', 'like', "%{$request->search}%")
                  ->orWhere('customer', 'like', "%{$request->search}%")
                  ->orWhere('tujuan', 'like', "%{$request->search}%")
                  ->orWhere('asal', 'like', "%{$request->search}%");
            });
        }

        if ($request->status_verifikasi) {
            $query->where('status_verifikasi', $request->status_verifikasi);
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

        $laporan = $query->orderByDesc('tanggal_laporan')->paginate(20)->withQueryString();

        // Transform for laporan format sesuai output yang diminta
        $laporan->getCollection()->transform(fn ($l) => [
            'id'                => $l->id,
            'perintah_id'       => $l->perintah_perjalanan_id,
            'tanggal'           => $l->perintah->tanggal_berangkat->format('d-M'),
            'nopol'             => $l->perintah->kendaraan->nopol,
            'driver'            => $l->perintah->driver->name,
            'customer'          => $l->perintah->customer,
            'asal'              => $l->perintah->asal,
            'tujuan'            => $l->perintah->tujuan,
            'harga'             => $l->perintah->harga,
            'biaya_transport'   => $l->total_biaya_transport,
            'orderan'           => (float)$l->perintah->harga - (float)$l->total_biaya_transport,
            'biaya_bbm'         => $l->biaya_bbm,
            'biaya_tol'         => $l->biaya_tol,
            'biaya_parkir'      => $l->biaya_parkir,
            'biaya_lain'        => $l->biaya_lain,
            'keterangan_biaya'  => $l->keterangan_biaya,
            'bukti_transfer'    => $l->bukti_transfer,
            'status_verifikasi' => $l->status_verifikasi,
            'catatan_atasan'    => $l->catatan_atasan,
            'tanggal_verifikasi'=> $l->tanggal_verifikasi?->format('d/m/Y'),
            'verifikator'       => $l->verifikator?->name,
        ]);

        // Summary totals
        $totalHarga = $query->clone()->join('perintah_perjalanan', 'laporan_keuangan.perintah_perjalanan_id', '=', 'perintah_perjalanan.id')->sum('perintah_perjalanan.harga');
        $totalBiaya = $query->clone()->sum('total_biaya_transport');

        $drivers = User::where('level', 3)->where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Laporan/Index', [
            'laporan'       => $laporan,
            'driverList'    => $drivers,
            'filters'       => $request->only(['search', 'status_verifikasi', 'nopol', 'driver_id', 'bulan']),
            'summary'       => [
                'total_harga'   => $totalHarga,
                'total_biaya'   => $totalBiaya,
                'total_orderan' => $totalHarga - $totalBiaya,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'perintah_perjalanan_id' => 'required|exists:perintah_perjalanan,id',
            'tanggal_laporan'        => 'required|date',
            'biaya_bbm'              => 'nullable|numeric|min:0',
            'biaya_tol'              => 'nullable|numeric|min:0',
            'biaya_parkir'           => 'nullable|numeric|min:0',
            'biaya_lain'             => 'nullable|numeric|min:0',
            'keterangan_biaya'       => 'nullable|string',
        ]);

        $perintah = PerintahPerjalanan::findOrFail($request->perintah_perjalanan_id);

        $laporan = LaporanKeuangan::updateOrCreate(
            ['perintah_perjalanan_id' => $request->perintah_perjalanan_id],
            [
                'laporan_perjalanan_id' => $perintah->laporanPerjalanan?->id,
                'created_by'            => Auth::id(),
                'tanggal_laporan'       => $request->tanggal_laporan,
                'biaya_bbm'             => $request->biaya_bbm ?? 0,
                'biaya_tol'             => $request->biaya_tol ?? 0,
                'biaya_parkir'          => $request->biaya_parkir ?? 0,
                'biaya_lain'            => $request->biaya_lain ?? 0,
                'keterangan_biaya'      => $request->keterangan_biaya,
                'status_verifikasi'     => 'pending',
            ]
        );

        // Update status perintah jadi selesai
        $perintah->update(['status' => 'selesai']);

        // Notifikasi ke semua Atasan
        User::where('level', 1)->each(function ($atasan) use ($laporan, $perintah) {
            Notifikasi::kirim(
                $atasan->id,
                'Laporan Menunggu Verifikasi',
                "Laporan perjalanan {$perintah->nomor_perintah} perlu diverifikasi.",
                'verifikasi',
                $laporan->id,
                "/atasan/verifikasi/{$laporan->id}"
            );
        });

        return back()->with('success', 'Laporan keuangan berhasil disimpan.');
    }

    public function update(Request $request, LaporanKeuangan $laporanKeuangan)
    {
        if ($laporanKeuangan->status_verifikasi === 'diverifikasi') {
            return back()->with('error', 'Laporan yang sudah diverifikasi tidak bisa diubah.');
        }

        $request->validate([
            'biaya_bbm'        => 'nullable|numeric|min:0',
            'biaya_tol'        => 'nullable|numeric|min:0',
            'biaya_parkir'     => 'nullable|numeric|min:0',
            'biaya_lain'       => 'nullable|numeric|min:0',
            'keterangan_biaya' => 'nullable|string',
        ]);

        $laporanKeuangan->update($request->only([
            'biaya_bbm', 'biaya_tol', 'biaya_parkir', 'biaya_lain', 'keterangan_biaya'
        ]));

        return back()->with('success', 'Laporan keuangan berhasil diperbarui.');
    }

    public function export(Request $request)
    {
        return Excel::download(new LaporanKeuanganExport($request), 'Laporan_Keuangan_SPT_Trans.xlsx');
    }
}
