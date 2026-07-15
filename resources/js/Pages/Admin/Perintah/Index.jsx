import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { EmptyState, Pagination, formatRupiah } from '@/Components/Shared';

const statusMap = {
    pending:    { cls: 'bg-label-warning',  label: 'Menunggu' },
    diterima:   { cls: 'bg-label-info',     label: 'Diterima' },
    berjalan:   { cls: 'bg-label-primary',  label: 'Berjalan' },
    selesai:    { cls: 'bg-label-success',  label: 'Selesai' },
    dibatalkan: { cls: 'bg-label-danger',   label: 'Dibatalkan' },
};

const statusVerifMap = {
    pending:      { cls: 'bg-label-warning', label: 'Belum Diverifikasi' },
    diverifikasi: { cls: 'bg-label-success', label: 'Diverifikasi' },
    ditolak:      { cls: 'bg-label-danger',  label: 'Ditolak' },
};

export default function PerintahIndex({ perintah, kendaraanList, driverList, filters }) {
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [filterStatus, setFilterStatus] = useState(filters.status || '');
    const [filterNopol, setFilterNopol] = useState(filters.nopol || '');
    const [filterDriver, setFilterDriver] = useState(filters.driver_id || '');
    const [filterBulan, setFilterBulan] = useState(filters.bulan || '');

    const { data, setData, post, processing, errors, reset } = useForm({
        kendaraan_id: '',
        driver_id: '',
        tanggal_berangkat: '',
        tanggal_kembali_rencana: '',
        customer: '',
        asal: '',
        tujuan: '',
        harga: '',
        estimasi_biaya: '',
        keperluan: '',
        catatan_admin: '',
    });

    const applyFilter = (e) => {
        e.preventDefault();
        router.get('/admin/perintah', { search, status: filterStatus, nopol: filterNopol, driver_id: filterDriver, bulan: filterBulan }, { preserveState: true });
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.perintah.store'), { onSuccess: () => { reset(); setShowForm(false); } });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Perintah Perjalanan — SPT Trans" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Perintah Perjalanan</h4>
                    <p className="text-muted mb-0">Kelola perintah perjalanan driver</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <i className="bx bx-plus me-1"></i> Buat Perintah
                </button>
            </div>

            {/* Filter */}
            <div className="card mb-4">
                <div className="card-body">
                    <form onSubmit={applyFilter} className="row g-2 align-items-end">
                        <div className="col-md-3">
                            <label className="form-label form-label-sm">Cari</label>
                            <input className="form-control form-control-sm" placeholder="Nopol, customer, tujuan..." value={search} onChange={e => setSearch(e.target.value)} />
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Nopol</label>
                            <select className="form-select form-select-sm" value={filterNopol} onChange={e => setFilterNopol(e.target.value)}>
                                <option value="">Semua</option>
                                {kendaraanList.map(k => <option key={k.id} value={k.nopol}>{k.nopol}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Driver</label>
                            <select className="form-select form-select-sm" value={filterDriver} onChange={e => setFilterDriver(e.target.value)}>
                                <option value="">Semua</option>
                                {driverList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Status</label>
                            <select className="form-select form-select-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                                <option value="">Semua</option>
                                <option value="pending">Menunggu</option>
                                <option value="diterima">Diterima</option>
                                <option value="berjalan">Berjalan</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <label className="form-label form-label-sm">Bulan</label>
                            <input type="month" className="form-control form-control-sm" value={filterBulan} onChange={e => setFilterBulan(e.target.value)} />
                        </div>
                        <div className="col-md-1">
                            <button type="submit" className="btn btn-sm btn-outline-primary w-100">Filter</button>
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
                                {perintah.data.length === 0 ? (
                                    <tr><td colSpan="11"><EmptyState message="Belum ada perintah perjalanan." /></td></tr>
                                ) : perintah.data.map(p => (
                                    <tr key={p.id}>
                                        <td>{p.tanggal_berangkat}</td>
                                        <td><span className="fw-semibold text-primary">{p.nopol}</span></td>
                                        <td>{p.driver}</td>
                                        <td>{p.customer || '-'}</td>
                                        <td>{p.asal}</td>
                                        <td>{p.tujuan}</td>
                                        <td className="text-end">{formatRupiah(p.harga)}</td>
                                        <td className="text-end">{p.biaya_transport > 0 ? formatRupiah(p.biaya_transport) : '-'}</td>
                                        <td className="text-end fw-semibold">{p.biaya_transport > 0 ? formatRupiah(p.orderan) : '-'}</td>
                                        <td>
                                            <span className={`badge ${statusMap[p.status]?.cls}`}>{statusMap[p.status]?.label}</span>
                                            {p.status_verifikasi && (
                                                <span className={`badge ${statusVerifMap[p.status_verifikasi]?.cls} ms-1`} style={{fontSize:'10px'}}>
                                                    {statusVerifMap[p.status_verifikasi]?.label}
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            <a href={`/admin/perintah/${p.id}`} className="btn btn-sm btn-icon btn-outline-primary">
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
                    <Pagination links={perintah.links} />
                </div>
            </div>

            {/* Modal Buat Perintah */}
            {showForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Buat Perintah Perjalanan</h5>
                                <button className="btn-close" onClick={() => { setShowForm(false); reset(); }}></button>
                            </div>
                            <form onSubmit={submit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Kendaraan (Nopol) *</label>
                                            <select className={`form-select ${errors.kendaraan_id ? 'is-invalid' : ''}`} value={data.kendaraan_id} onChange={e => setData('kendaraan_id', e.target.value)} required>
                                                <option value="">Pilih Kendaraan</option>
                                                {kendaraanList.map(k => <option key={k.id} value={k.id}>{k.nopol} — {k.merk}</option>)}
                                            </select>
                                            {errors.kendaraan_id && <div className="invalid-feedback">{errors.kendaraan_id}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Driver *</label>
                                            <select className={`form-select ${errors.driver_id ? 'is-invalid' : ''}`} value={data.driver_id} onChange={e => setData('driver_id', e.target.value)} required>
                                                <option value="">Pilih Driver</option>
                                                {driverList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                            </select>
                                            {errors.driver_id && <div className="invalid-feedback">{errors.driver_id}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Tanggal Berangkat *</label>
                                            <input type="date" className={`form-control ${errors.tanggal_berangkat ? 'is-invalid' : ''}`} value={data.tanggal_berangkat} onChange={e => setData('tanggal_berangkat', e.target.value)} required />
                                            {errors.tanggal_berangkat && <div className="invalid-feedback">{errors.tanggal_berangkat}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Tanggal Kembali (Rencana)</label>
                                            <input type="date" className="form-control" value={data.tanggal_kembali_rencana} onChange={e => setData('tanggal_kembali_rencana', e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Customer</label>
                                            <input type="text" className="form-control" placeholder="Nama customer" value={data.customer} onChange={e => setData('customer', e.target.value)} />
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Asal *</label>
                                            <input type="text" className={`form-control ${errors.asal ? 'is-invalid' : ''}`} placeholder="Kota asal" value={data.asal} onChange={e => setData('asal', e.target.value)} required />
                                            {errors.asal && <div className="invalid-feedback">{errors.asal}</div>}
                                        </div>
                                        <div className="col-md-4">
                                            <label className="form-label">Tujuan *</label>
                                            <input type="text" className={`form-control ${errors.tujuan ? 'is-invalid' : ''}`} placeholder="Kota tujuan" value={data.tujuan} onChange={e => setData('tujuan', e.target.value)} required />
                                            {errors.tujuan && <div className="invalid-feedback">{errors.tujuan}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Harga (Rp) *</label>
                                            <input type="number" className={`form-control ${errors.harga ? 'is-invalid' : ''}`} placeholder="0" value={data.harga} onChange={e => setData('harga', e.target.value)} required min="0" />
                                            {errors.harga && <div className="invalid-feedback">{errors.harga}</div>}
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Estimasi Biaya Transport (Rp)</label>
                                            <input type="number" className="form-control" placeholder="0" value={data.estimasi_biaya} onChange={e => setData('estimasi_biaya', e.target.value)} min="0" />
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Keperluan / Keterangan</label>
                                            <textarea className="form-control" rows="2" value={data.keperluan} onChange={e => setData('keperluan', e.target.value)}></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Catatan Admin (untuk driver)</label>
                                            <textarea className="form-control" rows="2" value={data.catatan_admin} onChange={e => setData('catatan_admin', e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); reset(); }}>Batal</button>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Buat Perintah'}
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
