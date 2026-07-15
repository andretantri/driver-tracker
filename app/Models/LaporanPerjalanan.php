<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanPerjalanan extends Model
{
    protected $table = 'laporan_perjalanan';

    protected $fillable = [
        'perintah_perjalanan_id',
        'driver_id',
        'tanggal_berangkat_aktual',
        'tanggal_kembali_aktual',
        'odometer_awal',
        'odometer_akhir',
        'total_km',
        'catatan_driver',
        'bukti_perjalanan',
        'status',
    ];

    protected $casts = [
        'tanggal_berangkat_aktual' => 'date',
        'tanggal_kembali_aktual' => 'date',
        'bukti_perjalanan' => 'array',
    ];

    public function perintah()
    {
        return $this->belongsTo(PerintahPerjalanan::class, 'perintah_perjalanan_id');
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function laporanKeuangan()
    {
        return $this->hasOne(LaporanKeuangan::class);
    }
}
