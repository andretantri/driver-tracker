import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, StatusBadge, StatusVerifBadge, EmptyState, Pagination } from '@/Components/Shared';

export default function DriverDashboard({ perintahAktif, riwayat }) {
    const [showDetail, setShowDetail] = useState(null);
    const [showLaporanForm, setShowLaporanForm] = useState(null);

    const terimaForm = useForm({});
    const laporanForm = useForm({
        tanggal_berangkat_aktual: '',
        tanggal_kembali_aktual: '',
        odometer_awal: '',
        odometer_akhir: '',
        catatan_driver: '',
        bukti_perjalanan: [],
        submit_final: false,
    });

    const handleTerima = (perintahId) => {
        if (!confirm('Terima perintah perjalanan ini?')) return;
        router.patch(`/driver/perintah/${perintahId}/terima`);
    };

    const handleLaporanSubmit = (e, perintahId, isFinal) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(laporanForm.data).forEach(([key, val]) => {
            if (key === 'bukti_perjalanan') {
                for (let f of val) formData.append('bukti_perjalanan[]', f);
            } else {
                formData.append(key, val);
            }
        });
        if (isFinal) formData.set('submit_final', '1');
        router.post(`/driver/perintah/${perintahId}/laporan`, formData, {
            forceFormData: true,
            onSuccess: () => setShowLaporanForm(null),
        });
    };

    const statusBg = {
        pending:    'border-warning',
        diterima:   'border-info',
        berjalan:   'border-primary',
        selesai:    'border-success',
        dibatalkan: 'border-danger',
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Driver — SPT Trans" />

            <div className="mb-4">
                <h4 className="fw-bold mb-0">Dashboard Driver</h4>
                <p className="text-muted">Perintah perjalanan dan laporan Anda</p>
            </div>

            {/* Perintah Aktif */}
            <h6 className="fw-semibold text-uppercase text-muted mb-3">
                <i className="bx bx-send me-2"></i>Perintah Aktif ({perintahAktif.length})
            </h6>

            {perintahAktif.length === 0 ? (
                <div className="card mb-4">
                    <div className="card-body text-center text-muted py-5">
                        <i className="bx bx-inbox" style={{fontSize: '3rem'}}></i>
                        <p className="mt-2">Tidak ada perintah aktif saat ini.</p>
                    </div>
                </div>
            ) : perintahAktif.map(p => (
                <div key={p.id} className={`card mb-3 border-start border-4 ${statusBg[p.status] || ''}`}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h6 className="fw-bold mb-1">{p.nomor_perintah}</h6>
                                <small className="text-muted">{p.tanggal_berangkat}</small>
                            </div>
                            <StatusBadge status={p.status} />
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <p className="mb-1"><i className="bx bx-car text-primary me-1"></i><strong>{p.nopol}</strong> — {p.merk}</p>
                                <p className="mb-1"><i className="bx bx-user me-1"></i>Customer: {p.customer || '-'}</p>
                            </div>
                            <div className="col-6">
                                <p className="mb-1"><i className="bx bx-map-pin me-1"></i>{p.asal} <i className="bx bx-right-arrow-alt"></i> {p.tujuan}</p>
                                <p className="mb-1"><i className="bx bx-money me-1"></i>Harga: <strong>{formatRupiah(p.harga)}</strong></p>
                            </div>
                        </div>
                        {p.keperluan && <p className="mb-1 text-muted" style={{fontSize:'12px'}}><i className="bx bx-info-circle me-1"></i>{p.keperluan}</p>}
                        {p.catatan_admin && <p className="mb-2 text-warning" style={{fontSize:'12px'}}><i className="bx bx-bell me-1"></i>Catatan Admin: {p.catatan_admin}</p>}

                        <div className="d-flex gap-2 mt-2">
                            {p.status === 'pending' && (
                                <button className="btn btn-sm btn-success" onClick={() => handleTerima(p.id)}>
                                    <i className="bx bx-check me-1"></i> Terima Perintah
                                </button>
                            )}
                            {['diterima', 'berjalan'].includes(p.status) && (
                                <button className="btn btn-sm btn-primary" onClick={() => setShowLaporanForm(p)}>
                                    <i className="bx bx-upload me-1"></i> Input Laporan
                                </button>
                            )}
                            <a href={`/driver/perintah/${p.id}`} className="btn btn-sm btn-outline-secondary">
                                <i className="bx bx-show me-1"></i> Detail
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            {/* Riwayat Perjalanan */}
            <h6 className="fw-semibold text-uppercase text-muted mb-3 mt-4">
                <i className="bx bx-history me-2"></i>Riwayat Perjalanan
            </h6>
            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{fontSize: '13px'}}>
                            <thead className="table-light">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nopol</th>
                                    <th>Customer</th>
                                    <th>Asal → Tujuan</th>
                                    <th className="text-end">Harga</th>
                                    <th className="text-end">Biaya Transport</th>
                                    <th className="text-end">Orderan</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {riwayat.data.length === 0 ? (
                                    <tr><td colSpan="8"><EmptyState message="Belum ada riwayat perjalanan." /></td></tr>
                                ) : riwayat.data.map(r => (
                                    <tr key={r.id} className="cursor-pointer" onClick={() => window.location.href = `/driver/perintah/${r.id}`}>
                                        <td>{r.tanggal_berangkat}</td>
                                        <td><span className="fw-semibold text-primary">{r.nopol}</span></td>
                                        <td>{r.customer || '-'}</td>
                                        <td>{r.asal} → {r.tujuan}</td>
                                        <td className="text-end">{formatRupiah(r.harga)}</td>
                                        <td className="text-end">{r.biaya_transport != null ? formatRupiah(r.biaya_transport) : '-'}</td>
                                        <td className="text-end fw-semibold text-success">{r.orderan != null ? formatRupiah(r.orderan) : '-'}</td>
                                        <td>
                                            <StatusBadge status={r.status} />
                                            {r.status_verifikasi && <StatusVerifBadge status={r.status_verifikasi} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Pagination links={riwayat.links} />
                </div>
            </div>

            {/* Modal Input Laporan */}
            {showLaporanForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Input Laporan Perjalanan</h5>
                                <button className="btn-close" onClick={() => setShowLaporanForm(null)}></button>
                            </div>
                            <form onSubmit={(e) => handleLaporanSubmit(e, showLaporanForm.id, false)} encType="multipart/form-data">
                                <div className="modal-body">
                                    <div className="p-2 rounded mb-3" style={{background: '#f0f4ff'}}>
                                        <strong>{showLaporanForm.nomor_perintah}</strong> — {showLaporanForm.asal} → {showLaporanForm.tujuan}
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Tanggal Berangkat Aktual</label>
                                            <input type="date" className="form-control" value={laporanForm.data.tanggal_berangkat_aktual} onChange={e => laporanForm.setData('tanggal_berangkat_aktual', e.target.value)} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Tanggal Kembali Aktual</label>
                                            <input type="date" className="form-control" value={laporanForm.data.tanggal_kembali_aktual} onChange={e => laporanForm.setData('tanggal_kembali_aktual', e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Odometer Awal (km)</label>
                                            <input type="number" className="form-control" value={laporanForm.data.odometer_awal} onChange={e => laporanForm.setData('odometer_awal', e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Odometer Akhir (km)</label>
                                            <input type="number" className="form-control" value={laporanForm.data.odometer_akhir} onChange={e => laporanForm.setData('odometer_akhir', e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Total KM</label>
                                            <input type="number" className="form-control" readOnly
                                                value={laporanForm.data.odometer_akhir && laporanForm.data.odometer_awal
                                                    ? parseInt(laporanForm.data.odometer_akhir) - parseInt(laporanForm.data.odometer_awal)
                                                    : ''
                                                }
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Catatan Driver</label>
                                            <textarea className="form-control" rows="2" value={laporanForm.data.catatan_driver} onChange={e => laporanForm.setData('catatan_driver', e.target.value)}></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Bukti Perjalanan (foto/dokumen)</label>
                                            <input type="file" className="form-control" multiple accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={e => laporanForm.setData('bukti_perjalanan', Array.from(e.target.files))}
                                            />
                                            <small className="text-muted">Bisa upload beberapa foto. Format: JPG, PNG, PDF.</small>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowLaporanForm(null)}>Batal</button>
                                    <button type="submit" className="btn btn-outline-primary" disabled={laporanForm.processing}>
                                        Simpan Draft
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={(e) => handleLaporanSubmit(e, showLaporanForm.id, true)} disabled={laporanForm.processing}>
                                        <i className="bx bx-send me-1"></i> Submit Final
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
