import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/Shared';

const StatCard = ({ label, value, color, icon, sub }) => (
    <div className="col-lg-3 col-sm-6 mb-4">
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                    <div>
                        <span className="text-muted d-block mb-1" style={{fontSize:'12px'}}>{label}</span>
                        <h4 className="mb-0 fw-bold">{value}</h4>
                        {sub && <small className="text-muted">{sub}</small>}
                    </div>
                    <div className="avatar flex-shrink-0">
                        <span className={`avatar-initial rounded bg-label-${color}`}>
                            <i className={`bx ${icon}`}></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default function AtasanDashboard({ stats, menungguVerif }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Atasan — SPT Trans" />

            <div className="mb-4">
                <h4 className="fw-bold mb-0">Dashboard Atasan</h4>
                <p className="text-muted">Ringkasan keuangan operasional PT Sukarno Putro Trans</p>
            </div>

            {/* Stats Row 1 - Trip stats */}
            <div className="row">
                <StatCard label="Total Perintah" value={stats.total_perintah} color="primary" icon="bx-send" />
                <StatCard label="Perjalanan Selesai" value={stats.perintah_selesai} color="success" icon="bx-check-double" />
                <StatCard label="Menunggu Verifikasi" value={stats.laporan_pending} color="warning" icon="bx-time" />
                <StatCard label="Sudah Diverifikasi" value={stats.laporan_diverifikasi} color="info" icon="bx-shield-check" />
            </div>

            {/* Stats Row 2 - Financial */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <p className="text-muted mb-1">Total Harga (Pendapatan)</p>
                            <h3 className="fw-bold text-primary">{formatRupiah(stats.total_harga)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body text-center">
                            <p className="text-muted mb-1">Total Biaya Transport</p>
                            <h3 className="fw-bold text-danger">{formatRupiah(stats.total_biaya_transport)}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card" style={{border: '2px solid #28a745'}}>
                        <div className="card-body text-center">
                            <p className="text-muted mb-1">Total Orderan (Net)</p>
                            <h3 className="fw-bold text-success">{formatRupiah(stats.total_orderan)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Menunggu Verifikasi */}
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Laporan Menunggu Verifikasi</h5>
                    <a href="/atasan/verifikasi" className="btn btn-sm btn-primary">Lihat Semua</a>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{fontSize: '13px'}}>
                            <thead className="table-light">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nopol</th>
                                    <th>Driver</th>
                                    <th>Tujuan</th>
                                    <th className="text-end">Harga</th>
                                    <th className="text-end">Biaya Transport</th>
                                    <th className="text-end">Orderan</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menungguVerif.length === 0 ? (
                                    <tr><td colSpan="8" className="text-center py-4 text-muted">
                                        <i className="bx bx-check-circle text-success me-2"></i>
                                        Semua laporan sudah diverifikasi!
                                    </td></tr>
                                ) : menungguVerif.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.tanggal}</td>
                                        <td><span className="fw-semibold text-primary">{l.nopol}</span></td>
                                        <td>{l.driver}</td>
                                        <td>{l.tujuan}</td>
                                        <td className="text-end">{formatRupiah(l.harga)}</td>
                                        <td className="text-end text-danger">{formatRupiah(l.biaya_transport)}</td>
                                        <td className="text-end fw-bold text-success">{formatRupiah(l.orderan)}</td>
                                        <td>
                                            <a href={`/atasan/verifikasi/${l.id}`} className="btn btn-sm btn-warning">
                                                <i className="bx bx-check-shield me-1"></i> Verifikasi
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
