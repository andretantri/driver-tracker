import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatRupiah, EmptyState, Pagination } from '@/Components/Shared';

export default function AtasanLaporanIndex({ laporan, driverList, filters, summary }) {
    const [filterNopol, setFilterNopol] = useState(filters.nopol || '');
    const [filterDriver, setFilterDriver] = useState(filters.driver_id || '');
    const [filterBulan, setFilterBulan] = useState(filters.bulan || '');

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/atasan/laporan', { nopol: filterNopol, driver_id: filterDriver, bulan: filterBulan }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Rekap Laporan — SPT Trans" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Rekap Laporan</h4>
                    <p className="text-muted mb-0">Laporan perjalanan yang sudah diverifikasi</p>
                </div>
            </div>

            {/* Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={applyFilter} className="row g-2 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label form-label-sm">Filter Nopol</label>
                            <input className="form-control form-control-sm" placeholder="Contoh: AD 8319 OB" value={filterNopol} onChange={e => setFilterNopol(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label form-label-sm">Filter Driver</label>
                            <select className="form-select form-select-sm" value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
                                <option value="">Semua Driver</option>
                                {driverList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label form-label-sm">Bulan</label>
                            <input type="month" className="form-control form-control-sm" value={filterBulan} onChange={e => setFilterBulan(e.target.value)} />
                        </div>
                        <div className="col-md-3">
                            <button type="submit" className="btn btn-sm btn-primary w-100">Terapkan Filter</button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Summary Totals */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-2">
                            <small className="text-muted">Total Harga</small>
                            <h5 className="fw-bold text-primary mb-0">{formatRupiah(summary.totalHarga)}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body py-2">
                            <small className="text-muted">Total Biaya Transport</small>
                            <h5 className="fw-bold text-danger mb-0">{formatRupiah(summary.totalBiaya)}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card text-center" style={{border: '2px solid #28a745'}}>
                        <div className="card-body py-2">
                            <small className="text-muted">Total Orderan</small>
                            <h5 className="fw-bold text-success mb-0">{formatRupiah(summary.totalOrderan)}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Laporan Table — same format as the image */}
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
                                </tr>
                            </thead>
                            <tbody>
                                {laporan.data.length === 0 ? (
                                    <tr><td colSpan="9"><EmptyState message="Belum ada laporan diverifikasi." /></td></tr>
                                ) : laporan.data.map((l, i) => (
                                    <tr key={l.id} style={i % 2 === 0 ? {background: '#fff'} : {background: '#f8f9fa'}}>
                                        <td>{l.tanggal}</td>
                                        <td><span className="fw-semibold text-primary">{l.nopol}</span></td>
                                        <td>{l.driver}</td>
                                        <td>{l.customer || '-'}</td>
                                        <td>{l.asal}</td>
                                        <td>{l.tujuan}</td>
                                        <td className="text-end">{formatRupiah(l.harga)}</td>
                                        <td className="text-end text-danger">{formatRupiah(l.biaya_transport)}</td>
                                        <td className="text-end fw-bold text-success">{formatRupiah(l.orderan)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            {laporan.data.length > 0 && (
                                <tfoot style={{background: '#f0f4ff', fontWeight: 'bold'}}>
                                    <tr>
                                        <td colSpan="6" className="text-end">TOTAL</td>
                                        <td className="text-end">{formatRupiah(summary.totalHarga)}</td>
                                        <td className="text-end text-danger">{formatRupiah(summary.totalBiaya)}</td>
                                        <td className="text-end text-success">{formatRupiah(summary.totalOrderan)}</td>
                                    </tr>
                                </tfoot>
                            )}
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
