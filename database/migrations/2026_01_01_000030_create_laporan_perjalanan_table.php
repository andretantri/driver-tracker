<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_perjalanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('perintah_perjalanan_id')->constrained('perintah_perjalanan')->onDelete('cascade');
            $table->foreignId('driver_id')->constrained('users')->onDelete('restrict');
            $table->date('tanggal_berangkat_aktual')->nullable();
            $table->date('tanggal_kembali_aktual')->nullable();
            $table->integer('odometer_awal')->nullable();
            $table->integer('odometer_akhir')->nullable();
            $table->integer('total_km')->nullable();
            $table->text('catatan_driver')->nullable();
            $table->json('bukti_perjalanan')->nullable()->comment('Array path foto/dokumen');
            $table->enum('status', ['draft', 'submitted'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_perjalanan');
    }
};
