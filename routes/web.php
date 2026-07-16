<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Root redirect to login
Route::get('/', fn () => redirect()->route('login'));

// ─────────────────────────────────────────────────────────────
// ADMIN ROUTES  (level 2)
// ─────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])
            ->name('dashboard');

        // Kendaraan
        Route::get('/kendaraan', [\App\Http\Controllers\Admin\KendaraanController::class, 'index'])->name('kendaraan.index');
        Route::post('/kendaraan', [\App\Http\Controllers\Admin\KendaraanController::class, 'store'])->name('kendaraan.store');
        Route::put('/kendaraan/{kendaraan}', [\App\Http\Controllers\Admin\KendaraanController::class, 'update'])->name('kendaraan.update');
        Route::delete('/kendaraan/{kendaraan}', [\App\Http\Controllers\Admin\KendaraanController::class, 'destroy'])->name('kendaraan.destroy');

        // Driver
        Route::get('/driver', [\App\Http\Controllers\Admin\DriverController::class, 'index'])->name('driver.index');
        Route::post('/driver', [\App\Http\Controllers\Admin\DriverController::class, 'store'])->name('driver.store');
        Route::put('/driver/{driver}', [\App\Http\Controllers\Admin\DriverController::class, 'update'])->name('driver.update');
        Route::delete('/driver/{driver}', [\App\Http\Controllers\Admin\DriverController::class, 'destroy'])->name('driver.destroy');

        // Pengaturan
        Route::get('/pengaturan', [\App\Http\Controllers\Admin\PengaturanController::class, 'index'])->name('pengaturan.index');
        Route::post('/pengaturan', [\App\Http\Controllers\Admin\PengaturanController::class, 'update'])->name('pengaturan.update');

        // Perintah Perjalanan
        Route::get('/perintah', [\App\Http\Controllers\Admin\PerintahController::class, 'index'])->name('perintah.index');
        Route::post('/perintah', [\App\Http\Controllers\Admin\PerintahController::class, 'store'])->name('perintah.store');
        Route::get('/perintah/{perintah}', [\App\Http\Controllers\Admin\PerintahController::class, 'show'])->name('perintah.show');
        Route::patch('/perintah/{perintah}/cancel', [\App\Http\Controllers\Admin\PerintahController::class, 'cancel'])->name('perintah.cancel');
        Route::post('/perintah/{perintah}/bukti-transfer', [\App\Http\Controllers\Admin\PerintahController::class, 'uploadBuktiTransfer'])->name('perintah.bukti-transfer');

        // Laporan Keuangan
        Route::get('/laporan', [\App\Http\Controllers\Admin\LaporanKeuanganController::class, 'index'])->name('laporan.index');
        Route::get('/laporan/export', [\App\Http\Controllers\Admin\LaporanKeuanganController::class, 'export'])->name('laporan.export');
        Route::post('/laporan', [\App\Http\Controllers\Admin\LaporanKeuanganController::class, 'store'])->name('laporan.store');
        Route::put('/laporan/{laporanKeuangan}', [\App\Http\Controllers\Admin\LaporanKeuanganController::class, 'update'])->name('laporan.update');
    });

// ─────────────────────────────────────────────────────────────
// ATASAN ROUTES  (level 1)
// ─────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:atasan'])
    ->prefix('atasan')
    ->name('atasan.')
    ->group(function () {

        Route::get('/dashboard', [\App\Http\Controllers\Atasan\DashboardController::class, 'index'])
            ->name('dashboard');

        Route::get('/verifikasi', [\App\Http\Controllers\Atasan\VerifikasiController::class, 'index'])->name('verifikasi.index');
        Route::get('/verifikasi/{laporan}', [\App\Http\Controllers\Atasan\VerifikasiController::class, 'show'])->name('verifikasi.show');
        Route::post('/verifikasi/{laporan}', [\App\Http\Controllers\Atasan\VerifikasiController::class, 'verifikasi'])->name('verifikasi.aksi');

        Route::get('/laporan', [\App\Http\Controllers\Atasan\VerifikasiController::class, 'laporan'])->name('laporan.index');
    });

// ─────────────────────────────────────────────────────────────
// DRIVER ROUTES  (level 3)
// ─────────────────────────────────────────────────────────────
Route::middleware(['auth', 'role:driver'])
    ->prefix('driver')
    ->name('driver.')
    ->group(function () {

        Route::get('/dashboard', [\App\Http\Controllers\Driver\PerintahController::class, 'index'])
            ->name('dashboard');

        Route::get('/perintah/{perintah}', [\App\Http\Controllers\Driver\PerintahController::class, 'show'])->name('perintah.show');
        Route::patch('/perintah/{perintah}/terima', [\App\Http\Controllers\Driver\PerintahController::class, 'terima'])->name('perintah.terima');
        Route::post('/perintah/{perintah}/laporan', [\App\Http\Controllers\Driver\PerintahController::class, 'inputLaporan'])->name('perintah.laporan');
    });

// Notifikasi (all auth)
Route::middleware('auth')->group(function () {
    Route::get('/notifikasi', function () {
        $notif = auth()->user()->notifikasi()->orderByDesc('created_at')->paginate(20);
        return Inertia::render('Notifikasi', ['notifikasi' => $notif]);
    })->name('notifikasi.index');

    Route::patch('/notifikasi/{notifikasi}/read', function (\App\Models\Notifikasi $notifikasi) {
        if ($notifikasi->user_id === auth()->id()) {
            $notifikasi->update(['is_read' => true]);
        }
        return back();
    })->name('notifikasi.read');

    Route::patch('/notifikasi/read-all', function () {
        auth()->user()->notifikasiUnread()->update(['is_read' => true]);
        return back()->with('success', 'Semua notifikasi telah dibaca.');
    })->name('notifikasi.read-all');
});

require __DIR__.'/auth.php';
