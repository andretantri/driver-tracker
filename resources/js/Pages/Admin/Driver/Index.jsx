import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { EmptyState, Pagination } from '@/Components/Shared';

export default function DriverIndex({ drivers, filters }) {
    const [showForm, setShowForm] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [search, setSearch] = useState(filters.search || '');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        username: '', name: '', phone: '', password: '', password_confirmation: '', is_active: true,
    });

    const openEdit = (item) => {
        setEditItem(item);
        setData({ username: item.username, name: item.name, phone: item.phone || '', password: '', password_confirmation: '', is_active: item.is_active });
        setShowForm(true);
    };

    const closeForm = () => { setShowForm(false); setEditItem(null); reset(); };

    const submit = (e) => {
        e.preventDefault();
        if (editItem) {
            put(route('admin.driver.update', editItem.id), { onSuccess: closeForm });
        } else {
            post(route('admin.driver.store'), { onSuccess: closeForm });
        }
    };

    const handleDeactivate = (id) => {
        if (confirm('Nonaktifkan driver ini?')) router.delete(route('admin.driver.destroy', id));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Driver — SPT Trans" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-0">Manajemen Driver</h4>
                    <p className="text-muted mb-0">Kelola akun login driver</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <i className="bx bx-plus me-1"></i> Tambah Driver
                </button>
            </div>

            <div className="card mb-3">
                <div className="card-body py-2">
                    <input className="form-control form-control-sm" style={{maxWidth:'300px'}} placeholder="Cari nama, username..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); router.get('/admin/driver', { search: e.target.value }, { preserveState: true }); }}
                    />
                </div>
            </div>

            <div className="card">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>Username</th>
                                    <th>Nama</th>
                                    <th>No. HP</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {drivers.data.length === 0 ? (
                                    <tr><td colSpan="6"><EmptyState message="Belum ada data driver." /></td></tr>
                                ) : drivers.data.map((d, i) => (
                                    <tr key={d.id}>
                                        <td>{(drivers.current_page - 1) * drivers.per_page + i + 1}</td>
                                        <td><span className="fw-semibold">{d.username}</span></td>
                                        <td>{d.name}</td>
                                        <td>{d.phone || '-'}</td>
                                        <td>
                                            <span className={`badge ${d.is_active ? 'bg-label-success' : 'bg-label-danger'}`}>
                                                {d.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-icon btn-outline-primary me-1" onClick={() => openEdit(d)}><i className="bx bx-edit"></i></button>
                                            {d.is_active && (
                                                <button className="btn btn-sm btn-icon btn-outline-danger" onClick={() => handleDeactivate(d.id)}><i className="bx bx-user-x"></i></button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="card-footer">
                    <Pagination links={drivers.links} />
                </div>
            </div>

            {showForm && (
                <div className="modal show d-block" style={{background: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editItem ? 'Edit Driver' : 'Tambah Driver'}</h5>
                                <button className="btn-close" onClick={closeForm}></button>
                            </div>
                            <form onSubmit={submit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <label className="form-label">Username *</label>
                                            <input type="text" className={`form-control ${errors.username ? 'is-invalid' : ''}`} value={data.username} onChange={e => setData('username', e.target.value)} required />
                                            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Nama Lengkap *</label>
                                            <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={data.name} onChange={e => setData('name', e.target.value)} required />
                                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                        </div>
                                        <div className="col-12">
                                            <label className="form-label">No. HP</label>
                                            <input type="tel" className="form-control" value={data.phone} onChange={e => setData('phone', e.target.value)} />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Password {editItem ? '(kosongkan jika tidak diubah)' : '*'}</label>
                                            <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={data.password} onChange={e => setData('password', e.target.value)} required={!editItem} />
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label">Konfirmasi Password</label>
                                            <input type="password" className="form-control" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} required={!editItem} />
                                        </div>
                                        {editItem && (
                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id="is_active" checked={data.is_active} onChange={e => setData('is_active', e.target.checked)} />
                                                    <label className="form-check-label" htmlFor="is_active">Akun Aktif</label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeForm}>Batal</button>
                                    <button type="submit" className="btn btn-primary" disabled={processing}>
                                        {processing ? 'Menyimpan...' : editItem ? 'Update' : 'Tambah Driver'}
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
