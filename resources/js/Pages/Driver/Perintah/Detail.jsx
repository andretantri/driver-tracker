import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, StatusBadge, StatusVerifBadge } from '@/Components/Shared';

export default function PerintahDetail({ perintah }) {
    const [showLaporanForm, setShowLaporanForm] = useState(false);

    const laporanForm = useForm({
        tanggal_berangkat_aktual: perintah.laporan_perjalanan?.tanggal_berangkat_aktual || '',
        tanggal_kembali_aktual: perintah.laporan_perjalanan?.tanggal_kembali_aktual || '',
        odometer_awal: perintah.laporan_perjalanan?.odometer_awal || '',
        odometer_akhir: perintah.laporan_perjalanan?.odometer_akhir || '',
        catatan_driver: perintah.laporan_perjalanan?.catatan_driver || '',
        bukti_perjalanan: [],
        submit_final: false,
    });

    const handleLaporanSubmit = (e, isFinal) => {
        e.preventDefault();
        const formData = new FormData();
        Object.entries(laporanForm.data).forEach(([key, val]) => {
            if (key === 'bukti_perjalanan') {
                for (let f of val) formData.append('bukti_perjalanan[]', f);
            } else if (key !== 'submit_final') {
                if (val !== null && val !== undefined) {
                    formData.append(key, val);
                }
            }
        });
        if (isFinal) formData.set('submit_final', '1');
        
        router.post(`/driver/perintah/${perintah.id}/laporan`, formData, {
            forceFormData: true,
            onSuccess: () => setShowLaporanForm(false),
        });
    };

    const handleCetak = () => {
        window.print();
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

            <div className="d-flex justify-content-between align-items-center mb-4 d-print-none">
                <div>
                    <a href="/driver/dashboard" className="btn btn-sm btn-outline-secondary me-2">
                        <i className="bx bx-arrow-back"></i>
                    </a>
                    <span className="h5 fw-bold">{perintah.nomor_perintah}</span>
                </div>
                <div>
                    <button className="btn btn-sm btn-secondary me-2" onClick={handleCetak}>
                        <i className="bx bx-printer me-1"></i> Cetak
                    </button>
                    <StatusBadge status={perintah.status} />
                </div>
            </div>

            <div className="row">
                {/* Info Perjalanan */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header"><h6 className="mb-0"><i className="bx bx-map-pin me-2"></i>Info Perjalanan</h6></div>
                        <div className="card-body">
                            <InfoRow label="Nomor Perintah" value={perintah.nomor_perintah} />
                            <InfoRow label="Tanggal Berangkat" value={perintah.tanggal_berangkat} />
                            <InfoRow label="Kembali (Rencana)" value={perintah.tanggal_kembali_rencana} />
                            <InfoRow label="Diterima Pada" value={perintah.diterima_at} />
                            <hr />
                            <InfoRow label="Nopol" value={perintah.nopol} />
                            <InfoRow label="Kendaraan" value={perintah.merk} />
                            <hr />
                            <InfoRow label="Customer" value={perintah.customer} />
                            <InfoRow label="Asal" value={perintah.asal} />
                            <InfoRow label="Tujuan" value={perintah.tujuan} />
                            <InfoRow label="Keperluan" value={perintah.keperluan} />
                            <InfoRow label="Catatan Admin" value={perintah.catatan_admin} />
                        </div>
                    </div>
                </div>

                {/* Laporan Perjalanan (Driver) */}
                <div className="col-md-6 mb-4">
                    <div className="card h-100">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h6 className="mb-0"><i className="bx bx-trip me-2"></i>Laporan Perjalanan</h6>
                            {['diterima', 'berjalan'].includes(perintah.status) && (
                                <button className="btn btn-sm btn-primary d-print-none" onClick={() => setShowLaporanForm(true)}>
                                    <i className="bx bx-plus me-1"></i> Update Laporan
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {perintah.laporan_perjalanan ? (
                                <>
                                    <InfoRow label="Status Laporan" value={
                                        <span className={`badge bg-${perintah.laporan_perjalanan.status === 'submitted' ? 'success' : 'warning'}`}>
                                            {perintah.laporan_perjalanan.status}
                                        </span>
                                    } />
                                    <InfoRow label="Tgl Berangkat Aktual" value={perintah.laporan_perjalanan.tanggal_berangkat_aktual} />
                                    <InfoRow label="Tgl Kembali Aktual" value={perintah.laporan_perjalanan.tanggal_kembali_aktual} />
                                    <InfoRow label="Odometer Awal" value={perintah.laporan_perjalanan.odometer_awal ? `${perintah.laporan_perjalanan.odometer_awal.toLocaleString()} km` : null} />
                                    <InfoRow label="Odometer Akhir" value={perintah.laporan_perjalanan.odometer_akhir ? `${perintah.laporan_perjalanan.odometer_akhir.toLocaleString()} km` : null} />
                                    <InfoRow label="Total KM" value={perintah.laporan_perjalanan.total_km ? `${perintah.laporan_perjalanan.total_km.toLocaleString()} km` : null} />
                                    <InfoRow label="Catatan" value={perintah.laporan_perjalanan.catatan_driver} />
                                    
                                    <hr />
                                    <p className="text-muted mb-2" style={{fontSize: '13px'}}><strong>Bukti Perjalanan:</strong></p>
                                    {perintah.laporan_perjalanan.bukti_perjalanan?.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2 d-print-none">
                                            {perintah.laporan_perjalanan.bukti_perjalanan.map((path, i) => (
                                                <a key={i} href={`/storage/${path}`} target="_blank" className="btn btn-sm btn-outline-secondary">
                                                    <i className="bx bx-image me-1"></i> Bukti {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    ) : <p className="text-muted" style={{fontSize: '13px'}}>Belum ada bukti yang diupload.</p>}
                                </>
                            ) : (
                                <div className="text-center text-muted py-4">
                                    <i className="bx bx-receipt" style={{fontSize: '2rem'}}></i>
                                    <p className="mt-2">Belum ada laporan perjalanan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Input Laporan Perjalanan */}
            {showLaporanForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Input Laporan Perjalanan</h5>
                                <button className="btn-close" onClick={() => setShowLaporanForm(false)}></button>
                            </div>
                            <form onSubmit={(e) => handleLaporanSubmit(e, false)} encType="multipart/form-data">
                                <div className="modal-body">
                                    <div className="p-2 rounded mb-3" style={{background: '#f0f4ff'}}>
                                        <strong>{perintah.nomor_perintah}</strong> — {perintah.asal} → {perintah.tujuan}
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
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowLaporanForm(false)}>Batal</button>
                                    <button type="submit" className="btn btn-outline-primary" disabled={laporanForm.processing}>
                                        Simpan Draft
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={(e) => handleLaporanSubmit(e, true)} disabled={laporanForm.processing}>
                                        <i className="bx bx-send me-1"></i> Submit Final
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @media print {
                    .d-print-none { display: none !important; }
                    .card { border: none !important; box-shadow: none !important; }
                    .card-header { background-color: transparent !important; border-bottom: 2px solid #000 !important; }
                    body { background-color: white !important; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
