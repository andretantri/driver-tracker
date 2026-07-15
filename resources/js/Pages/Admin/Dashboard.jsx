import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah } from '@/Components/Shared';

const StatCard = ({ icon, label, value, color, sub }) => (
    <div className="col-lg-3 col-sm-6 mb-4">
        <div className="card h-100">
            <div className="card-body">
                <div className="d-flex align-items-start justify-content-between">
                    <div>
                        <span className="text-muted d-block mb-1" style={{fontSize:'13px'}}>{label}</span>
                        <h3 className="mb-0 fw-bold">{value}</h3>
                        {sub && <small className="text-muted">{sub}</small>}
                    </div>
                    <div className={`avatar flex-shrink-0`}>
                        <span className={`avatar-initial rounded bg-label-${color}`}>
                            <i className={`bx ${icon}`}></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const statusMap = {
    pending:    { cls: 'bg-label-warning',  label: 'Menunggu' },
    diterima:   { cls: 'bg-label-info',     label: 'Diterima' },
    berjalan:   { cls: 'bg-label-primary',  label: 'Berjalan' },
    selesai:    { cls: 'bg-label-success',  label: 'Selesai' },
    dibatalkan: { cls: 'bg-label-danger',   label: 'Dibatalkan' },
};

export default function AdminDashboard({ stats, perintahTerbaru }) {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard Admin — SPT Trans" />

            <div className="row mb-2">
                <div className="col-12">
                    <h4 className="fw-bold mb-0">Dashboard Admin</h4>
                    <p className="text-muted">Sistem Manajemen Keuangan Operasional PT Sukarno Putro Trans</p>
                </div>
            </div>

            {/* Stats */}
            <div className="row">
                <StatCard icon="bx-send" label="Total Perintah" value={stats.total_perintah} color="primary" />
                <StatCard icon="bx-time" label="Perintah Pending" value={stats.perintah_pending} color="warning" />
                <StatCard icon="bx-trip" label="Sedang Berjalan" value={stats.perintah_berjalan} color="info" />
                <StatCard icon="bx-check-double" label="Selesai" value={stats.perintah_selesai} color="success" />
                <StatCard icon="bx-shield-quarter" label="Menunggu Verifikasi" value={stats.laporan_pending_verif} color="danger" />
                <StatCard icon="bx-car" label="Kendaraan Aktif" value={stats.total_kendaraan} color="primary" />
                <StatCard icon="bx-id-card" label="Driver Aktif" value={stats.total_driver} color="info" />
            </div>

            {/* Recent Perintah */}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Perintah Terbaru</h5>
                            <a href="/admin/perintah" className="btn btn-sm btn-primary">
                                <i className="bx bx-plus me-1"></i> Buat Perintah
                            </a>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Tgl Berangkat</th>
                                            <th>Nopol</th>
                                            <th>Driver</th>
                                            <th>Customer</th>
                                            <th>Asal → Tujuan</th>
                                            <th className="text-end">Harga</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {perintahTerbaru.length === 0 ? (
                                            <tr><td colSpan="7" className="text-center py-4 text-muted">Belum ada perintah perjalanan.</td></tr>
                                        ) : perintahTerbaru.map(p => (
                                            <tr key={p.id} className="cursor-pointer" onClick={() => window.location.href = `/admin/perintah/${p.id}`}>
                                                <td>{p.tanggal_berangkat}</td>
                                                <td><span className="fw-semibold text-primary">{p.nopol}</span></td>
                                                <td>{p.driver}</td>
                                                <td>{p.customer || '-'}</td>
                                                <td>{p.asal} <i className="bx bx-right-arrow-alt"></i> {p.tujuan}</td>
                                                <td className="text-end fw-semibold">{formatRupiah(p.harga)}</td>
                                                <td>
                                                    <span className={`badge ${statusMap[p.status]?.cls || 'bg-label-secondary'}`}>
                                                        {statusMap[p.status]?.label || p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
