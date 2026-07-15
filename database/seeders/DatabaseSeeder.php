<?php

namespace Database\Seeders;

use App\Models\Kendaraan;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Atasan
        User::create([
            'username' => 'atasan',
            'name' => 'Direktur Utama',
            'email' => 'atasan@spt.com',
            'phone' => '081234567890',
            'password' => Hash::make('password'),
            'level' => 1,
            'is_active' => true,
        ]);

        // Admin
        User::create([
            'username' => 'admin',
            'name' => 'Admin SPT',
            'email' => 'admin@spt.com',
            'phone' => '081234567891',
            'password' => Hash::make('password'),
            'level' => 2,
            'is_active' => true,
        ]);

        // Drivers
        $drivers = [
            ['username' => 'dwi', 'name' => 'DWI', 'phone' => '081234567892'],
            ['username' => 'alfiro', 'name' => 'ALFIRO', 'phone' => '081234567893'],
            ['username' => 'aris', 'name' => 'ARIS', 'phone' => '081234567894'],
            ['username' => 'adrian', 'name' => 'ADRIAN', 'phone' => '081234567895'],
        ];

        foreach ($drivers as $driver) {
            User::create([
                'username' => $driver['username'],
                'name' => $driver['name'],
                'phone' => $driver['phone'],
                'password' => Hash::make('password'),
                'level' => 3,
                'is_active' => true,
            ]);
        }

        // Sample kendaraan
        $kendaraan = [
            ['nopol' => 'AD 8319 OB', 'merk' => 'Mitsubishi', 'tipe' => 'Colt Diesel', 'tahun' => 2020],
            ['nopol' => 'AD 8265 OB', 'merk' => 'Mitsubishi', 'tipe' => 'Colt Diesel', 'tahun' => 2019],
            ['nopol' => 'AD 8318 OB', 'merk' => 'Hino', 'tipe' => 'Dutro', 'tahun' => 2021],
            ['nopol' => 'AD 8116 OB', 'merk' => 'Hino', 'tipe' => 'Dutro', 'tahun' => 2020],
        ];

        foreach ($kendaraan as $k) {
            Kendaraan::create(array_merge($k, ['status' => 'aktif']));
        }
    }
}
