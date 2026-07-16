import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, StatusVerifBadge, EmptyState, Pagination } from '@/Components/Shared';

export default function AdminLaporanIndex({ laporan, driverList, filters, summary }) {
    const [filterSearch, setFilterSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status_verifikasi || '');
    const [filterNopol, setFilterNopol] = useState(filters.nopol || '');
    const [filterDriver, setFilterDriver] = useState(filters.driver_id || '');
    const [filterBulan, setFilterBulan] = useState(filters.bulan || '');

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/admin/laporan', {
            search: filterSearch, status_verifikasi: filterStatus,
            nopol: filterNopol, driver_id: filterDriver, bulan: filterBulan,
        }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Laporan Keuangan — SPT Trans" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Laporan Keuangan</h4>
                    <p className="text-muted">Rekap laporan keuangan perjalanan</p>
                </div>
                <div>
                    <a href={`/admin/laporan/export?search=${filters.search || ''}&status_verifikasi=${filters.status_verifikasi || ''}&nopol=${filters.nopol || ''}&driver_id=${filters.driver_id || ''}&bulan=${filters.bulan || ''}`} className="btn btn-success" target="_blank" rel="noopener noreferrer">
                        <i className="bx bx-export me-1"></i> Export Excel
                    </a>
                </div>
            </div>

            {/* Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={applyFilter} className="row g-2 align-items-end">
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Cari</label>
                            <input className="form-control form-control-sm" placeholder="Nomor, customer, kota..." value={filterSearch} onChange={e => setFilterSearch(e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Nopol</label>
                            <input className="form-control form-control-sm" placeholder="AD XXXX OB" value={filterNopol} onChange={e => setFilterNopol(e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Driver</label>
                            <select className="form-select form-select-sm" value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
                                <option value="">Semua</option>
                                {driverList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Status Verif</label>
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

            {/* Summary */}
            {summary && (
                <div className="row mb-4">
                    <div className="col-4">
                        <div className="card text-center"><div className="card-body py-2">
                            <small className="text-muted">Total Harga</small>
                            <h6 className="fw-bold text-primary mb-0">{formatRupiah(summary.total_harga)}</h6>
                        </div></div>
                    </div>
                    <div className="col-4">
                        <div className="card text-center"><div className="card-body py-2">
                            <small className="text-muted">Total Biaya Transport</small>
                            <h6 className="fw-bold text-danger mb-0">{formatRupiah(summary.total_biaya)}</h6>
                        </div></div>
                    </div>
                    <div className="col-4">
                        <div className="card text-center" style={{border:'2px solid #28a745'}}><div className="card-body py-2">
                            <small className="text-muted">Total Orderan</small>
                            <h6 className="fw-bold text-success mb-0">{formatRupiah(summary.total_orderan)}</h6>
                        </div></div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover table-bordered mb-0" style={{fontSize: '13px'}}>
                            <thead style={{background: '#4472C4', color: 'white'}}>
                                <tr>
                                    <th>TANGGAL</th>
                                    <th>NOPOL</th>
                                    <th>DRIVER</th>
                                    <th>CUSTOMER</th>
                                    <th>ASAL</th>
                                    <th>TUJUAN</th>
                                    <th className="text-end">Harga</th>
                                    <th className="text-end">Biaya Transport</th>
                                    <th className="text-end">Orderan</th>
                                    <th>Status Verif</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laporan.data.length === 0 ? (
                                    <tr><td colSpan="11"><EmptyState message="Belum ada laporan keuangan." /></td></tr>
                                ) : laporan.data.map((l, i) => (
                                    <tr key={l.id} style={i % 2 === 0 ? {} : {background: '#f8f9fa'}}>
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
                                            <a href={`/admin/perintah/${l.perintah_id}`} className="btn btn-sm btn-icon btn-outline-primary">
                                                <i className="bx bx-show"></i>
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
