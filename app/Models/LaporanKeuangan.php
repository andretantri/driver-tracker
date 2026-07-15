<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanKeuangan extends Model
{
    protected $table = 'laporan_keuangan';

    protected $fillable = [
        'perintah_perjalanan_id',
        'laporan_perjalanan_id',
        'created_by',
        'tanggal_laporan',
        'biaya_bbm',
        'biaya_tol',
        'biaya_parkir',
        'biaya_lain',
        'total_biaya_transport',
        'keterangan_biaya',
        'bukti_transfer',
        'status_verifikasi',
        'catatan_atasan',
        'diverifikasi_oleh',
        'tanggal_verifikasi',
    ];

    protected $casts = [
        'tanggal_laporan' => 'date',
        'biaya_bbm' => 'decimal:2',
        'biaya_tol' => 'decimal:2',
        'biaya_parkir' => 'decimal:2',
        'biaya_lain' => 'decimal:2',
        'total_biaya_transport' => 'decimal:2',
        'tanggal_verifikasi' => 'datetime',
    ];

    // Auto-calculate total before saving
    protected static function boot()
    {
        parent::boot();
        static::saving(function ($model) {
            $model->total_biaya_transport =
                ($model->biaya_bbm ?? 0) +
                ($model->biaya_tol ?? 0) +
                ($model->biaya_parkir ?? 0) +
                ($model->biaya_lain ?? 0);
        });
    }

    public function perintah()
    {
        return $this->belongsTo(PerintahPerjalanan::class, 'perintah_perjalanan_id');
    }

    public function laporanPerjalanan()
    {
        return $this->belongsTo(LaporanPerjalanan::class);
    }

    public function pembuat()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function verifikator()
    {
        return $this->belongsTo(User::class, 'diverifikasi_oleh');
    }
}
