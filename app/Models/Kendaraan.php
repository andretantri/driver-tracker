<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    protected $table = 'kendaraan';

    protected $fillable = [
        'nopol',
        'merk',
        'tipe',
        'tahun',
        'status',
        'keterangan',
    ];

    public function perintahPerjalanan()
    {
        return $this->hasMany(PerintahPerjalanan::class);
    }

    public function perintahAktif()
    {
        return $this->hasMany(PerintahPerjalanan::class)
            ->whereIn('status', ['pending', 'diterima', 'berjalan']);
    }
}
