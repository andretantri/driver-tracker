<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kendaraan;
use App\Models\Notifikasi;
use App\Models\PerintahPerjalanan;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PerintahController extends Controller
{
    public function index(Request $request)
    {
        $query = PerintahPerjalanan::with(['kendaraan', 'driver', 'laporanKeuangan']);

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nomor_perintah', 'like', "%{$request->search}%")
                  ->orWhere('customer', 'like', "%{$request->search}%")
                  ->orWhere('tujuan', 'like', "%{$request->search}%")
                  ->orWhere('asal', 'like', "%{$request->search}%")
                  ->orWhereHas('kendaraan', fn ($q2) => $q2->where('nopol', 'like', "%{$request->search}%"))
                  ->orWhereHas('driver', fn ($q2) => $q2->where('name', 'like', "%{$request->search}%"));
            });
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->nopol) {
            $query->whereHas('kendaraan', fn ($q) => $q->where('nopol', $request->nopol));
        }

        if ($request->driver_id) {
            $query->where('driver_id', $request->driver_id);
        }

        if ($request->bulan) {
            $query->whereMonth('tanggal_berangkat', date('m', strtotime($request->bulan)))
                  ->whereYear('tanggal_berangkat', date('Y', strtotime($request->bulan)));
        }

        $perintah = $query->orderByDesc('tanggal_berangkat')->paginate(20)->withQueryString();

        $perintah->getCollection()->transform(function ($p) {
            $biayaTransport = $p->laporanKeuangan ? $p->laporanKeuangan->total_biaya_transport : 0;
            return [
                'id'                => $p->id,
                'nomor_perintah'    => $p->nomor_perintah,
                'tanggal_berangkat' => $p->tanggal_berangkat->format('d-M-Y'),
                'nopol'             => $p->kendaraan->nopol,
                'driver'            => $p->driver->name,
                'customer'          => $p->customer,
                'asal'              => $p->asal,
                'tujuan'            => $p->tujuan,
                'harga'             => $p->harga,
                'biaya_transport'   => $biayaTransport,
                'orderan'           => (float)$p->harga - (float)$biayaTransport,
                'status'            => $p->status,
                'status_verifikasi' => $p->laporanKeuangan ? $p->laporanKeuangan->status_verifikasi : null,
            ];
        });

        $kendaraanList = Kendaraan::where('status', 'aktif')->orderBy('nopol')->get(['id', 'nopol', 'merk']);
        $driverList    = User::where('level', 3)->where('is_active', true)->orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Perintah/Index', [
            'perintah'      => $perintah,
            'kendaraanList' => $kendaraanList,
            'driverList'    => $driverList,
            'filters'       => $request->only(['search', 'status', 'nopol', 'driver_id', 'bulan']),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kendaraan_id'           => 'required|exists:kendaraan,id',
            'driver_id'              => 'required|exists:users,id',
            'tanggal_berangkat'      => 'required|date',
            'tanggal_kembali_rencana'=> 'nullable|date|after_or_equal:tanggal_berangkat',
            'customer'               => 'nullable|string|max:100',
            'asal'                   => 'required|string|max:100',
            'tujuan'                 => 'required|string|max:100',
            'harga'                  => 'required|numeric|min:0',
            'estimasi_biaya'         => 'nullable|numeric|min:0',
            'keperluan'              => 'nullable|string',
            'catatan_admin'          => 'nullable|string',
        ]);

        $perintah = PerintahPerjalanan::create([
            'nomor_perintah'          => PerintahPerjalanan::generateNomor(),
            'kendaraan_id'            => $request->kendaraan_id,
            'driver_id'               => $request->driver_id,
            'created_by'              => Auth::id(),
            'tanggal_perintah'        => now()->toDateString(),
            'tanggal_berangkat'       => $request->tanggal_berangkat,
            'tanggal_kembali_rencana' => $request->tanggal_kembali_rencana,
            'customer'                => $request->customer,
            'asal'                    => strtoupper($request->asal),
            'tujuan'                  => strtoupper($request->tujuan),
            'harga'                   => $request->harga,
            'estimasi_biaya'          => $request->estimasi_biaya ?? 0,
            'keperluan'               => $request->keperluan,
            'catatan_admin'           => $request->catatan_admin,
            'status'                  => 'pending',
        ]);

        // Kirim notifikasi ke driver
        Notifikasi::kirim(
            $request->driver_id,
            'Perintah Perjalanan Baru',
            "Anda mendapat perintah perjalanan {$perintah->nomor_perintah} ke {$perintah->tujuan}.",
            'perintah',
            $perintah->id,
            "/driver/perintah/{$perintah->id}"
        );

        return back()->with('success', "Perintah {$perintah->nomor_perintah} berhasil dibuat.");
    }

    public function show(PerintahPerjalanan $perintah)
    {
        $perintah->load(['kendaraan', 'driver', 'pembuat', 'laporanPerjalanan.driver', 'laporanKeuangan.verifikator']);

        $biayaTransport = $perintah->laporanKeuangan ? $perintah->laporanKeuangan->total_biaya_transport : 0;

        return Inertia::render('Admin/Perintah/Detail', [
            'perintah' => [
                'id'                     => $perintah->id,
                'nomor_perintah'         => $perintah->nomor_perintah,
                'tanggal_perintah'       => $perintah->tanggal_perintah->format('d/m/Y'),
                'tanggal_berangkat'      => $perintah->tanggal_berangkat->format('d/m/Y'),
                'tanggal_kembali_rencana'=> $perintah->tanggal_kembali_rencana?->format('d/m/Y'),
                'nopol'                  => $perintah->kendaraan->nopol,
                'merk_kendaraan'         => $perintah->kendaraan->merk . ' ' . $perintah->kendaraan->tipe,
                'driver'                 => $perintah->driver->name,
                'driver_phone'           => $perintah->driver->phone,
                'customer'               => $perintah->customer,
                'asal'                   => $perintah->asal,
                'tujuan'                 => $perintah->tujuan,
                'harga'                  => $perintah->harga,
                'biaya_transport'        => $biayaTransport,
                'orderan'                => (float)$perintah->harga - (float)$biayaTransport,
                'estimasi_biaya'         => $perintah->estimasi_biaya,
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
                'laporan_keuangan'       => $perintah->laporanKeuangan ? [
                    'id'                 => $perintah->laporanKeuangan->id,
                    'biaya_bbm'          => $perintah->laporanKeuangan->biaya_bbm,
                    'biaya_tol'          => $perintah->laporanKeuangan->biaya_tol,
                    'biaya_parkir'       => $perintah->laporanKeuangan->biaya_parkir,
                    'biaya_lain'         => $perintah->laporanKeuangan->biaya_lain,
                    'total_biaya_transport' => $perintah->laporanKeuangan->total_biaya_transport,
                    'keterangan_biaya'   => $perintah->laporanKeuangan->keterangan_biaya,
                    'bukti_transfer'     => $perintah->laporanKeuangan->bukti_transfer,
                    'status_verifikasi'  => $perintah->laporanKeuangan->status_verifikasi,
                    'catatan_atasan'     => $perintah->laporanKeuangan->catatan_atasan,
                    'tanggal_verifikasi' => $perintah->laporanKeuangan->tanggal_verifikasi?->format('d/m/Y'),
                    'verifikator'        => $perintah->laporanKeuangan->verifikator?->name,
                ] : null,
            ],
        ]);
    }

    public function cancel(PerintahPerjalanan $perintah)
    {
        if (!in_array($perintah->status, ['pending', 'diterima'])) {
            return back()->with('error', 'Perintah tidak bisa dibatalkan dalam status ini.');
        }
        $perintah->update(['status' => 'dibatalkan']);
        return back()->with('success', 'Perintah berhasil dibatalkan.');
    }

    public function uploadBuktiTransfer(Request $request, PerintahPerjalanan $perintah)
    {
        $request->validate([
            'bukti_transfer' => 'required|file|mimes:jpg,jpeg,png,pdf|max:5120',
        ]);

        $path = $request->file('bukti_transfer')->store('bukti-transfer', 'public');

        if ($perintah->laporanKeuangan) {
            $perintah->laporanKeuangan->update(['bukti_transfer' => $path]);
        }

        // Notifikasi driver
        Notifikasi::kirim(
            $perintah->driver_id,
            'Bukti Transfer Tersedia',
            "Bukti transfer untuk perjalanan {$perintah->nomor_perintah} telah diunggah.",
            'bukti_tf',
            $perintah->id,
            "/driver/perintah/{$perintah->id}"
        );

        return back()->with('success', 'Bukti transfer berhasil diunggah.');
    }
}
