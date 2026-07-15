<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_keuangan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('perintah_perjalanan_id')->constrained('perintah_perjalanan')->onDelete('cascade');
            $table->foreignId('laporan_perjalanan_id')->nullable()->constrained('laporan_perjalanan')->onDelete('set null');
            $table->foreignId('created_by')->constrained('users')->onDelete('restrict');
            $table->date('tanggal_laporan');
            $table->decimal('biaya_bbm', 15, 2)->default(0);
            $table->decimal('biaya_tol', 15, 2)->default(0);
            $table->decimal('biaya_parkir', 15, 2)->default(0);
            $table->decimal('biaya_lain', 15, 2)->default(0);
            $table->decimal('total_biaya_transport', 15, 2)->default(0)->comment('Total biaya transport = bbm+tol+parkir+lain');
            $table->text('keterangan_biaya')->nullable();
            $table->string('bukti_transfer')->nullable()->comment('Path file bukti TF ke driver');
            $table->enum('status_verifikasi', ['pending', 'diverifikasi', 'ditolak'])->default('pending');
            $table->text('catatan_atasan')->nullable();
            $table->foreignId('diverifikasi_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('tanggal_verifikasi')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_keuangan');
    }
};
