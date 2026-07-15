import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, StatusBadge, StatusVerifBadge } from '@/Components/Shared';

export default function PerintahDetail({ perintah }) {
    const [showBuktiTF, setShowBuktiTF] = useState(false);
    const [showLaporanForm, setShowLaporanForm] = useState(false);

    const buktiForm = useForm({ bukti_transfer: null });
    const laporanForm = useForm({
        perintah_perjalanan_id: perintah.id,
        tanggal_laporan: new Date().toISOString().split('T')[0],
        biaya_bbm: '',
        biaya_tol: '',
        biaya_parkir: '',
        biaya_lain: '',
        keterangan_biaya: '',
    });

    const submitBuktiTF = (e) => {
        e.preventDefault();
        buktiForm.post(`/admin/perintah/${perintah.id}/bukti-transfer`, {
            onSuccess: () => setShowBuktiTF(false),
        });
    };

    const submitLaporan = (e) => {
        e.preventDefault();
        laporanForm.post(route('admin.laporan.store'), {
            onSuccess: () => setShowLaporanForm(false),
        });
    };

    const InfoRow = ({ label, value }) => (
        <div className="row mb-2">
            <div className="col-5 text-muted" style={{fontSize:'13px'}}>{label}</div>
            <div className="col-7 fw-semibold" style={{fontSize:'13px'}}>{value || '-'}</div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Detail Perintah ${perintah.nomor_perintah}`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <a href="/admin/perintah" className="btn btn-sm btn-outline-secondary me-2">
                        <i className="bx bx-arrow-back"></i>
                    </a>
                    <span className="h5 fw-bold">{perintah.nomor_perintah}</span>
                </div>
                <div>
                    <StatusBadge status={perintah.status} />
                    {perintah.laporan_keuangan && (
                        <StatusVerifBadge status={perintah.laporan_keuangan.status_verifikasi} />
                    )}
                </div>
            </div>

            <div className="row">
                {/* Info Perjalanan */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header"><h6 className="mb-0"><i className="bx bx-map-pin me-2"></i>Info Perjalanan</h6></div>
                        <div className="card-body">
                            <InfoRow label="Nomor Perintah" value={perintah.nomor_perintah} />
                            <InfoRow label="Tanggal Perintah" value={perintah.tanggal_perintah} />
                            <InfoRow label="Tanggal Berangkat" value={perintah.tanggal_berangkat} />
                            <InfoRow label="Kembali (Rencana)" value={perintah.tanggal_kembali_rencana} />
                            <InfoRow label="Diterima Oleh Driver" value={perintah.diterima_at} />
                            <hr />
                            <InfoRow label="Nopol" value={perintah.nopol} />
                            <InfoRow label="Kendaraan" value={perintah.merk_kendaraan} />
                            <InfoRow label="Driver" value={perintah.driver} />
                            <InfoRow label="No. HP Driver" value={perintah.driver_phone} />
                            <hr />
                            <InfoRow label="Customer" value={perintah.customer} />
                            <InfoRow label="Asal" value={perintah.asal} />
                            <InfoRow label="Tujuan" value={perintah.tujuan} />
                            <InfoRow label="Keperluan" value={perintah.keperluan} />
                            <InfoRow label="Catatan Admin" value={perintah.catatan_admin} />
                        </div>
                    </div>
                </div>

                {/* Keuangan */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0"><i className="bx bx-money me-2"></i>Keuangan</h6>
                            {perintah.status === 'selesai' && !perintah.laporan_keuangan && (
                                <button className="btn btn-sm btn-primary" onClick={() => setShowLaporanForm(true)}>
                                    <i className="bx bx-plus me-1"></i> Input Laporan
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {/* Harga */}
                            <div className="p-3 rounded mb-3" style={{background: '#f0f4ff'}}>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Harga Customer</span>
                                    <span className="fw-bold text-primary fs-5">{formatRupiah(perintah.harga)}</span>
                                </div>
                            </div>

                            {perintah.laporan_keuangan ? (
                                <>
                                    <InfoRow label="Biaya BBM" value={formatRupiah(perintah.laporan_keuangan.biaya_bbm)} />
                                    <InfoRow label="Biaya Tol" value={formatRupiah(perintah.laporan_keuangan.biaya_tol)} />
                                    <InfoRow label="Biaya Parkir" value={formatRupiah(perintah.laporan_keuangan.biaya_parkir)} />
                                    <InfoRow label="Biaya Lain" value={formatRupiah(perintah.laporan_keuangan.biaya_lain)} />
                                    <hr />
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Total Biaya Transport</span>
                                        <span className="fw-bold text-danger">{formatRupiah(perintah.laporan_keuangan.total_biaya_transport)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted fw-semibold">Orderan (Net)</span>
                                        <span className="fw-bold text-success fs-5">{formatRupiah(perintah.orderan)}</span>
                                    </div>
                                    <hr />
                                    <InfoRow label="Status Verifikasi" value={<StatusVerifBadge status={perintah.laporan_keuangan.status_verifikasi} />} />
                                    {perintah.laporan_keuangan.catatan_atasan && (
                                        <InfoRow label="Catatan Atasan" value={perintah.laporan_keuangan.catatan_atasan} />
                                    )}
                                    {perintah.laporan_keuangan.verifikator && (
                                        <InfoRow label="Diverifikasi oleh" value={`${perintah.laporan_keuangan.verifikator} (${perintah.laporan_keuangan.tanggal_verifikasi})`} />
                                    )}

                                    {/* Bukti Transfer */}
                                    <hr />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className="fw-semibold">Bukti Transfer</span>
                                        <button className="btn btn-sm btn-outline-info" onClick={() => setShowBuktiTF(true)}>
                                            <i className="bx bx-upload me-1"></i>
                                            {perintah.laporan_keuangan.bukti_transfer ? 'Ganti' : 'Upload'}
                                        </button>
                                    </div>
                                    {perintah.laporan_keuangan.bukti_transfer && (
                                        <a href={`/storage/${perintah.laporan_keuangan.bukti_transfer}`} target="_blank" className="btn btn-sm btn-outline-success mt-2 w-100">
                                            <i className="bx bx-file me-1"></i> Lihat Bukti Transfer
                                        </a>
                                    )}
                                </>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <i className="bx bx-spreadsheet" style={{fontSize: '2rem'}}></i>
                                    <p className="mt-2">Laporan keuangan belum diinput.</p>
                                    <small>Driver perlu menyelesaikan perjalanan terlebih dahulu.</small>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Laporan Perjalanan Driver */}
                {perintah.laporan_perjalanan && (
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-header"><h6 className="mb-0"><i className="bx bx-trip me-2"></i>Laporan Perjalanan (dari Driver)</h6></div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-4">
                                        <InfoRow label="Tgl Berangkat Aktual" value={perintah.laporan_perjalanan.tanggal_berangkat_aktual} />
                                        <InfoRow label="Tgl Kembali Aktual" value={perintah.laporan_perjalanan.tanggal_kembali_aktual} />
                                        <InfoRow label="Odometer Awal" value={perintah.laporan_perjalanan.odometer_awal ? `${perintah.laporan_perjalanan.odometer_awal.toLocaleString()} km` : null} />
                                        <InfoRow label="Odometer Akhir" value={perintah.laporan_perjalanan.odometer_akhir ? `${perintah.laporan_perjalanan.odometer_akhir.toLocaleString()} km` : null} />
                                        <InfoRow label="Total KM" value={perintah.laporan_perjalanan.total_km ? `${perintah.laporan_perjalanan.total_km.toLocaleString()} km` : null} />
                                        <InfoRow label="Catatan Driver" value={perintah.laporan_perjalanan.catatan_driver} />
                                    </div>
                                    <div className="col-md-8">
                                        <p className="text-muted mb-2"><strong>Bukti Perjalanan:</strong></p>
                                        {perintah.laporan_perjalanan.bukti_perjalanan?.length > 0 ? (
                                            <div className="d-flex flex-wrap gap-2">
                                                {perintah.laporan_perjalanan.bukti_perjalanan.map((path, i) => (
                                                    <a key={i} href={`/storage/${path}`} target="_blank" className="btn btn-sm btn-outline-secondary">
                                                        <i className="bx bx-image me-1"></i> Bukti {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        ) : <p className="text-muted">Belum ada bukti.</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Input Laporan Keuangan */}
            {showLaporanForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Input Laporan Keuangan</h5>
                                <button className="btn-close" onClick={() => setShowLaporanForm(false)}></button>
                            </div>
                            <form onSubmit={submitLaporan}>
                                <div className="modal-body">
                                    <p className="text-muted mb-3">
                                        <strong>{perintah.nomor_perintah}</strong> — {perintah.asal} → {perintah.tujuan}
                                    </p>
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <label className="form-label">Tanggal Laporan *</label>
                                            <input type="date" className="form-control" value={laporanForm.data.tanggal_laporan} onChange={e => laporanForm.setData('tanggal_laporan', e.target.value)} required />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Biaya BBM (Rp)</label>
                                            <input type="number" className="form-control" placeholder="0" value={laporanForm.data.biaya_bbm} onChange={e => laporanForm.setData('biaya_bbm', e.target.value)} min="0" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Biaya Tol (Rp)</label>
                                            <input type="number" className="form-control" placeholder="0" value={laporanForm.data.biaya_tol} onChange={e => laporanForm.setData('biaya_tol', e.target.value)} min="0" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Biaya Parkir (Rp)</label>
                                            <input type="number" className="form-control" placeholder="0" value={laporanForm.data.biaya_parkir} onChange={e => laporanForm.setData('biaya_parkir', e.target.value)} min="0" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Biaya Lain-lain (Rp)</label>
                                            <input type="number" className="form-control" placeholder="0" value={laporanForm.data.biaya_lain} onChange={e => laporanForm.setData('biaya_lain', e.target.value)} min="0" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Keterangan Biaya</label>
                                            <textarea className="form-control" rows="2" value={laporanForm.data.keterangan_biaya} onChange={e => laporanForm.setData('keterangan_biaya', e.target.value)}></textarea>
                                        </div>
                                        <div className="col-12 p-3 rounded" style={{background: '#f0f4ff'}}>
                                            <div className="d-flex justify-content-between">
                                                <span>Total Biaya Transport</span>
                                                <strong className="text-danger">
                                                    {formatRupiah(
                                                        (parseFloat(laporanForm.data.biaya_bbm) || 0) +
                                                        (parseFloat(laporanForm.data.biaya_tol) || 0) +
                                                        (parseFloat(laporanForm.data.biaya_parkir) || 0) +
                                                        (parseFloat(laporanForm.data.biaya_lain) || 0)
                                                    )}
                                                </strong>
                                            </div>
                                            <div className="d-flex justify-content-between mt-1">
                                                <span>Orderan (Harga - Biaya)</span>
                                                <strong className="text-success">
                                                    {formatRupiah(
                                                        parseFloat(perintah.harga) - (
                                                            (parseFloat(laporanForm.data.biaya_bbm) || 0) +
                                                            (parseFloat(laporanForm.data.biaya_tol) || 0) +
                                                            (parseFloat(laporanForm.data.biaya_parkir) || 0) +
                                                            (parseFloat(laporanForm.data.biaya_lain) || 0)
                                                        )
                                                    )}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowLaporanForm(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary" disabled={laporanForm.processing}>
                                        {laporanForm.processing ? 'Menyimpan...' : 'Simpan Laporan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Upload Bukti Transfer */}
            {showBuktiTF && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Upload Bukti Transfer</h5>
                                <button className="btn-close" onClick={() => setShowBuktiTF(false)}></button>
                            </div>
                            <form onSubmit={submitBuktiTF} encType="multipart/form-data">
                                <div className="modal-body">
                                    <label className="form-label">File Bukti Transfer *</label>
                                    <input
                                        type="file"
                                        className={`form-control ${buktiForm.errors.bukti_transfer ? 'is-invalid' : ''}`}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={e => buktiForm.setData('bukti_transfer', e.target.files[0])}
                                        required
                                    />
                                    <small className="text-muted">Format: JPG, PNG, PDF. Maks 5MB.</small>
                                    {buktiForm.errors.bukti_transfer && <div className="invalid-feedback">{buktiForm.errors.bukti_transfer}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowBuktiTF(false)}>Batal</button>
                                    <button type="submit" className="btn btn-primary" disabled={buktiForm.processing}>
                                        {buktiForm.processing ? 'Mengupload...' : 'Upload'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
