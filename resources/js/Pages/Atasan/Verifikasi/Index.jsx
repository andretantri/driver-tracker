import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, StatusBadge, StatusVerifBadge, EmptyState, Pagination } from '@/Components/Shared';
import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function AtasanVerifikasiIndex({ laporan, driverList, filters }) {
    const [filterNopol, setFilterNopol] = useState(filters.nopol || '');
    const [filterDriver, setFilterDriver] = useState(filters.driver_id || '');
    const [filterBulan, setFilterBulan] = useState(filters.bulan || '');
    const [filterStatus, setFilterStatus] = useState(filters.status_verifikasi || '');

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/atasan/verifikasi', { nopol: filterNopol, driver_id: filterDriver, bulan: filterBulan, status_verifikasi: filterStatus }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Verifikasi Laporan — SPT Trans" />

            <div className="mb-4">
                <h4 className="fw-bold mb-0">Verifikasi Laporan</h4>
                <p className="text-muted">Review dan verifikasi laporan keuangan perjalanan</p>
            </div>

            {/* Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={applyFilter} className="row g-2 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label form-label-sm">Nopol</label>
                            <input className="form-control form-control-sm" placeholder="Cari nopol..." value={filterNopol} onChange={e => setFilterNopol(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label form-label-sm">Driver</label>
                            <select className="form-select form-select-sm" value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
                                <option value="">Semua Driver</option>
                                {driverList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Status</label>
                            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option value="">Semua</option>
                                <option value="pending">Menunggu</option>
                                <option value="diverifikasi">Diverifikasi</option>
                                <option value="ditolak">Ditolak</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Bulan</label>
                            <input type="month" className="form-control form-control-sm" value={filterBulan} onChange={e => setFilterBulan(e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <button type="submit" className="btn btn-sm btn-primary w-100">Filter</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Table */}
            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0" style={{fontSize: '13px'}}>
                            <thead className="table-light">
                                <tr>
                                    <th>Tanggal</th>
                                    <th>Nopol</th>
                                    <th>Driver</th>
                                    <th>Customer</th>
                                    <th>Asal</th>
                                    <th>Tujuan</th>
                                    <th className="text-end">Harga</th>
                                    <th className="text-end">Biaya Transport</th>
                                    <th className="text-end">Orderan</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laporan.data.length === 0 ? (
                                    <tr><td colSpan="11"><EmptyState message="Tidak ada laporan yang perlu diverifikasi." /></td></tr>
                                ) : laporan.data.map(l => (
                                    <tr key={l.id}>
                                        <td>{l.tanggal}</td>
                                        <td><span className="fw-semibold text-primary">{l.nopol}</span></td>
                                        <td>{l.driver}</td>
                                        <td>{l.customer || '-'}</td>
                                        <td>{l.asal}</td>
                                        <td>{l.tujuan}</td>
                                        <td className="text-end">{formatRupiah(l.harga)}</td>
                                        <td className="text-end text-danger">{formatRupiah(l.biaya_transport)}</td>
                                        <td className="text-end fw-bold text-success">{formatRupiah(l.orderan)}</td>
                                        <td><StatusVerifBadge status={l.status_verifikasi} /></td>
                                        <td>
                                            <a href={`/atasan/verifikasi/${l.id}`} className="btn btn-sm btn-outline-primary">
                                                <i className="bx bx-check-shield me-1"></i> Review
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Pagination links={laporan.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
