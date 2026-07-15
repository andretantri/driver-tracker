<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('perintah_perjalanan', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_perintah', 50)->unique();
            $table->foreignId('kendaraan_id')->constrained('kendaraan')->onDelete('restrict');
            $table->foreignId('driver_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->date('tanggal_perintah');
            $table->date('tanggal_berangkat');
            $table->date('tanggal_kembali_rencana')->nullable();
            $table->string('customer')->nullable()->comment('Nama customer/pemilik barang');
            $table->string('asal')->comment('Kota asal');
            $table->string('tujuan')->comment('Kota tujuan');
            $table->decimal('harga', 15, 2)->default(0)->comment('Harga yang ditagih ke customer');
            $table->decimal('estimasi_biaya', 15, 2)->default(0);
            $table->text('keperluan')->nullable();
            $table->text('catatan_admin')->nullable();
            $table->enum('status', ['pending', 'diterima', 'berjalan', 'selesai', 'dibatalkan'])->default('pending');
            $table->timestamp('diterima_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('perintah_perjalanan');
    }
};
