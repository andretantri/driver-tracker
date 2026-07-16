<?php

namespace App\Exports;

use App\Models\LaporanKeuangan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class LaporanKeuanganExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = LaporanKeuangan::with([
            'perintah.kendaraan',
            'perintah.driver',
            'verifikator',
        ]);

        if ($this->request->search) {
            $query->whereHas('perintah', function ($q) {
                $q->where('nomor_perintah', 'like', "%{$this->request->search}%")
                  ->orWhere('customer', 'like', "%{$this->request->search}%")
                  ->orWhere('tujuan', 'like', "%{$this->request->search}%")
                  ->orWhere('asal', 'like', "%{$this->request->search}%");
            });
        }

        if ($this->request->status_verifikasi) {
            $query->where('status_verifikasi', $this->request->status_verifikasi);
        }

        if ($this->request->nopol) {
            $query->whereHas('perintah.kendaraan', fn ($q) => $q->where('nopol', $this->request->nopol));
        }

        if ($this->request->driver_id) {
            $query->whereHas('perintah', fn ($q) => $q->where('driver_id', $this->request->driver_id));
        }

        if ($this->request->bulan) {
            $query->whereMonth('tanggal_laporan', date('m', strtotime($this->request->bulan)))
                  ->whereYear('tanggal_laporan', date('Y', strtotime($this->request->bulan)));
        }

        return $query->orderByDesc('tanggal_laporan')->get();
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Nopol',
            'Driver',
            'Customer',
            'Asal',
            'Tujuan',
            'Harga',
            'Total Biaya Transport',
            'Orderan',
            'Biaya BBM',
            'Biaya Tol',
            'Biaya Parkir',
            'Biaya Lain',
            'Keterangan Biaya',
            'Status Verifikasi',
        ];
    }

    public function map($laporan): array
    {
        $harga = (float) $laporan->perintah->harga;
        $totalBiayaTransport = (float) $laporan->total_biaya_transport;
        $orderan = $harga - $totalBiayaTransport;

        return [
            $laporan->perintah->tanggal_berangkat->format('Y-m-d'),
            $laporan->perintah->kendaraan->nopol,
            $laporan->perintah->driver->name,
            $laporan->perintah->customer,
            $laporan->perintah->asal,
            $laporan->perintah->tujuan,
            $harga,
            $totalBiayaTransport,
            $orderan,
            (float) $laporan->biaya_bbm,
            (float) $laporan->biaya_tol,
            (float) $laporan->biaya_parkir,
            (float) $laporan->biaya_lain,
            $laporan->keterangan_biaya,
            ucfirst($laporan->status_verifikasi),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true]],
        ];
    }
}
