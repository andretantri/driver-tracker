import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, StatusVerifBadge } from '@/Components/Shared';

export default function VerifikasiDetail({ laporan }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        aksi: '',
        catatan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/atasan/verifikasi/${laporan.id}`, { onSuccess: () => setShowForm(false) });
    };

    const InfoRow = ({ label, value }) => (
        <div className="row mb-2">
            <div className="col-5 text-muted" style={{fontSize:'13px'}}>{label}</div>
            <div className="col-7 fw-semibold" style={{fontSize:'13px'}}>{value || '-'}</div>
        </div>
    );

    return (
        <AuthenticatedLayout>
            <Head title={`Verifikasi — ${laporan.nomor_perintah}`} />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <a href="/atasan/verifikasi" className="btn btn-sm btn-outline-secondary me-2">
                        <i className="bx bx-arrow-back"></i>
                    </a>
                    <span className="h5 fw-bold">Review Laporan: {laporan.nomor_perintah}</span>
                </div>
                {laporan.status_verifikasi === 'pending' && (
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <i className="bx bx-check-shield me-1"></i> Verifikasi
                    </button>
                )}
            </div>

            <div className="row">
                {/* Info Perjalanan */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header"><h6 className="mb-0">Info Perjalanan</h6></div>
                        <div className="card-body">
                            <InfoRow label="Nomor Perintah" value={laporan.nomor_perintah} />
                            <InfoRow label="Tanggal Berangkat" value={laporan.tanggal_berangkat} />
                            <InfoRow label="Nopol" value={<span className="fw-bold text-primary">{laporan.nopol}</span>} />
                            <InfoRow label="Kendaraan" value={laporan.merk_kendaraan} />
                            <InfoRow label="Driver" value={laporan.driver} />
                            <InfoRow label="Customer" value={laporan.customer} />
                            <InfoRow label="Asal" value={laporan.asal} />
                            <InfoRow label="Tujuan" value={laporan.tujuan} />
                        </div>
                    </div>
                </div>

                {/* Keuangan Summary */}
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header"><h6 className="mb-0">Ringkasan Keuangan</h6></div>
                        <div className="card-body">
                            <div className="p-3 rounded mb-3" style={{background: '#e8f4fd'}}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span>Harga Customer</span>
                                    <span className="fw-bold fs-4 text-primary">{formatRupiah(laporan.harga)}</span>
                                </div>
                            </div>
                            <InfoRow label="Biaya BBM" value={formatRupiah(laporan.biaya_bbm)} />
                            <InfoRow label="Biaya Tol" value={formatRupiah(laporan.biaya_tol)} />
                            <InfoRow label="Biaya Parkir" value={formatRupiah(laporan.biaya_parkir)} />
                            <InfoRow label="Biaya Lain-lain" value={formatRupiah(laporan.biaya_lain)} />
                            {laporan.keterangan_biaya && (
                                <InfoRow label="Keterangan Biaya" value={laporan.keterangan_biaya} />
                            )}
                            <hr />
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Total Biaya Transport</span>
                                <span className="fw-bold text-danger fs-5">{formatRupiah(laporan.total_biaya_transport)}</span>
                            </div>
                            <div className="p-3 rounded" style={{background: '#e8f9f0'}}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-semibold">ORDERAN (Net)</span>
                                    <span className="fw-bold fs-3 text-success">{formatRupiah(laporan.orderan)}</span>
                                </div>
                            </div>

                            {laporan.bukti_transfer && (
                                <a href={`/storage/${laporan.bukti_transfer}`} target="_blank" className="btn btn-sm btn-outline-info w-100 mt-3">
                                    <i className="bx bx-file me-1"></i> Lihat Bukti Transfer
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bukti Perjalanan */}
                {laporan.bukti_perjalanan?.length > 0 && (
                    <div className="col-12 mb-4">
                        <div className="card">
                            <div className="card-header"><h6 className="mb-0">Bukti Perjalanan (dari Driver)</h6></div>
                            <div className="card-body">
                                <div className="d-flex flex-wrap gap-2">
                                    {laporan.bukti_perjalanan.map((path, i) => (
                                        <a key={i} href={`/storage/${path}`} target="_blank" className="btn btn-outline-secondary btn-sm">
                                            <i className="bx bx-image me-1"></i> Bukti {i + 1}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status Verifikasi */}
                <div className="col-12">
                    <div className="card">
                        <div className="card-header"><h6 className="mb-0">Status Verifikasi</h6></div>
                        <div className="card-body">
                            <InfoRow label="Status" value={<StatusVerifBadge status={laporan.status_verifikasi} />} />
                            {laporan.catatan_atasan && <InfoRow label="Catatan Atasan" value={laporan.catatan_atasan} />}
                            {laporan.verifikator && <InfoRow label="Diverifikasi oleh" value={`${laporan.verifikator} — ${laporan.tanggal_verifikasi}`} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Verifikasi */}
            {showForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Verifikasi Laporan</h5>
                                <button className="btn-close" onClick={() => setShowForm(false)}></button>
                            </div>
                            <form onSubmit={submit}>
                                <div className="modal-body">
                                    <div className="p-3 rounded mb-3" style={{background: '#f8f9fa'}}>
                                        <div className="d-flex justify-content-between">
                                            <span>Harga</span><strong>{formatRupiah(laporan.harga)}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span>Biaya Transport</span><strong className="text-danger">{formatRupiah(laporan.total_biaya_transport)}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mt-2">
                                            <span className="fw-bold">Orderan</span><strong className="text-success fs-5">{formatRupiah(laporan.orderan)}</strong>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Keputusan *</label>
                                        <div className="d-flex gap-3">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="aksi" id="setuju" value="diverifikasi" checked={data.aksi === 'diverifikasi'} onChange={e => setData('aksi', e.target.value)} />
                                                <label className="form-check-label text-success fw-semibold" htmlFor="setuju">✓ Setujui</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="aksi" id="tolak" value="ditolak" checked={data.aksi === 'ditolak'} onChange={e => setData('aksi', e.target.value)} />
                                                <label className="form-check-label text-danger fw-semibold" htmlFor="tolak">✗ Tolak</label>
                                            </div>
                                        </div>
                                        {errors.aksi && <small className="text-danger">{errors.aksi}</small>}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Catatan (opsional)</label>
                                        <textarea className="form-control" rows="3" placeholder="Tambahkan catatan verifikasi..." value={data.catatan} onChange={e => setData('catatan', e.target.value)}></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
                                    <button type="submit" className={`btn ${data.aksi === 'ditolak' ? 'btn-danger' : 'btn-success'}`} disabled={processing || !data.aksi}>
                                        {processing ? 'Memproses...' : data.aksi === 'ditolak' ? 'Tolak Laporan' : 'Verifikasi Laporan'}
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
