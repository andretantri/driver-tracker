import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { EmptyState, Pagination } from '@/Components/Shared';

export default function KendaraanIndex({ kendaraan, filters }) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nopol: '', merk: '', tipe: '', tahun: '', status: 'aktif', keterangan: '',
    });

    const openEdit = (item) => {
        setEditItem(item);
        setData({ nopol: item.nopol, merk: item.merk, tipe: item.tipe || '', tahun: item.tahun || '', status: item.status, keterangan: item.keterangan || '' });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditItem(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editItem) {
            put(route('admin.kendaraan.update', editItem.id), { onSuccess: closeForm });
        } else {
            post(route('admin.kendaraan.store'), { onSuccess: closeForm });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Hapus kendaraan ini?')) router.delete(route('admin.kendaraan.destroy', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kendaraan — SPT Trans" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Master Kendaraan</h4>
                    <p className="text-muted mb-0">Kelola data kendaraan berdasarkan Nomor Polisi</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <i className="bx bx-plus me-1"></i> Tambah Kendaraan
                </button>
            </div>

            <div className="card mb-3">
                <div className="card-body py-2">
                    <div className="d-flex gap-2">
                        <input className="form-control form-control-sm" style={{maxWidth:'300px'}} placeholder="Cari nopol, merk..." value={search}
                            onChange={e => { setSearch(e.target.value); router.get('/admin/kendaraan', { search: e.target.value }, { preserveState: true }); }}
                        />
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Nomor Polisi</th>
                                    <th>Merk</th>
                                    <th>Tipe</th>
                                    <th>Tahun</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kendaraan.data.length === 0 ? (
                                    <tr><td colSpan="7"><EmptyState message="Belum ada data kendaraan." /></td></tr>
                                ) : kendaraan.data.map((k, i) => (
                                    <tr key={k.id}>
                                        <td>{(kendaraan.current_page - 1) * kendaraan.per_page + i + 1}</td>
                                        <td><span className="fw-bold text-primary">{k.nopol}</span></td>
                                        <td>{k.merk}</td>
                                        <td>{k.tipe || '-'}</td>
                                        <td>{k.tahun || '-'}</td>
                                        <td>
                                            <span className={`badge ${k.status === 'aktif' ? 'bg-label-success' : 'bg-label-secondary'}`}>
                                                {k.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-icon btn-outline-primary me-1" onClick={() => openEdit(k)}><i className="bx bx-edit"></i></button>
                                            <button className="btn btn-sm btn-icon btn-outline-danger" onClick={() => handleDelete(k.id)}><i className="bx bx-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Pagination links={kendaraan.links} />
                </div>
            </div>

            {showForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editItem ? 'Edit Kendaraan' : 'Tambah Kendaraan'}</h5>
                                <button className="btn-close" onClick={closeForm}></button>
                            </div>
                            <form onSubmit={submit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label className="form-label">Nomor Polisi *</label>
                                            <input type="text" className={`form-control ${errors.nopol ? 'is-invalid' : ''}`} placeholder="AD 1234 AB" value={data.nopol} onChange={e => setData('nopol', e.target.value)} required />
                                            {errors.nopol && <div className="invalid-feedback">{errors.nopol}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Merk *</label>
                                            <input type="text" className={`form-control ${errors.merk ? 'is-invalid' : ''}`} placeholder="Mitsubishi" value={data.merk} onChange={e => setData('merk', e.target.value)} required />
                                            {errors.merk && <div className="invalid-feedback">{errors.merk}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Tipe</label>
                                            <input type="text" className="form-control" placeholder="Colt Diesel" value={data.tipe} onChange={e => setData('tipe', e.target.value)} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Tahun</label>
                                            <input type="number" className="form-control" placeholder="2020" value={data.tahun} onChange={e => setData('tahun', e.target.value)} min="1990" max="2030" />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Status</label>
                                            <select className="form-select" value={data.status} onChange={e => setData('status', e.target.value)}>
                                                <option value="aktif">Aktif</option>
                                                <option value="nonaktif">Nonaktif</option>
                                            </select>
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">Keterangan</label>
                                            <textarea className="form-control" rows="2" value={data.keterangan} onChange={e => setData('keterangan', e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeForm}>Batal</button>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? 'Menyimpan...' : editItem ? 'Update' : 'Tambah'}
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
