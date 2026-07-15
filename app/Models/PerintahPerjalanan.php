<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerintahPerjalanan extends Model
{
    protected $table = 'perintah_perjalanan';

    protected $fillable = [
        'nomor_perintah',
        'kendaraan_id',
        'driver_id',
        'created_by',
        'tanggal_perintah',
        'tanggal_berangkat',
        'tanggal_kembali_rencana',
        'customer',
        'asal',
        'tujuan',
        'harga',
        'estimasi_biaya',
        'keperluan',
        'catatan_admin',
        'status',
        'diterima_at',
    ];

    protected $casts = [
        'tanggal_perintah' => 'date',
        'tanggal_berangkat' => 'date',
        'tanggal_kembali_rencana' => 'date',
        'harga' => 'decimal:2',
        'estimasi_biaya' => 'decimal:2',
        'diterima_at' => 'datetime',
    ];

    // Generate nomor perintah otomatis
    public static function generateNomor(): string
    {
        $prefix = 'SPT/' . date('Y/m/');
        $last = self::where('nomor_perintah', 'like', $prefix . '%')
            ->orderByDesc('id')->first();
        $seq = $last ? (intval(substr($last->nomor_perintah, -4)) + 1) : 1;
        return $prefix . str_pad($seq, 4, '0', STR_PAD_LEFT);
    }

    // Relationships
    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function laporanPerjalanan()
    {
        return $this->hasOne(LaporanPerjalanan::class);
    }

    public function laporanKeuangan()
    {
        return $this->hasOne(LaporanKeuangan::class);
    }

    // Computed
    public function getOrderanAttribute(): float
    {
        $biayaTransport = $this->laporanKeuangan ? $this->laporanKeuangan->total_biaya_transport : 0;
        return (float)$this->harga - (float)$biayaTransport;
    }
}
