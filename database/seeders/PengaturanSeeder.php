<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Pengaturan;

class PengaturanSeeder extends Seeder
{
    public function run(): void
    {
        if (Pengaturan::count() === 0) {
            Pengaturan::create([
                'nama_aplikasi' => 'Sistem Manajemen Keuangan',
                'nama_perusahaan' => 'PT Sukarno Putro Trans',
                'logo' => null,
            ]);
        }
    }
}
