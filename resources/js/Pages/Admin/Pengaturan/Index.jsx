import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function PengaturanIndex() {
    const { pengaturan } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        nama_aplikasi: pengaturan?.nama_aplikasi || '',
        nama_perusahaan: pengaturan?.nama_perusahaan || '',
        logo: null,
        remove_logo: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.pengaturan.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Sistem" />
            <div className="mb-4">
                <h4 className="fw-bold mb-0">Pengaturan Sistem</h4>
                <p className="text-muted">Konfigurasi nama aplikasi, nama perusahaan, dan logo.</p>
            </div>

            <div className="card">
                <div className="card-body">
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Nama Aplikasi *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.nama_aplikasi ? 'is-invalid' : ''}`}
                                    value={data.nama_aplikasi} 
                                    onChange={e => setData('nama_aplikasi', e.target.value)} 
                                    required 
                                />
                                {errors.nama_aplikasi && <div className="invalid-feedback">{errors.nama_aplikasi}</div>}
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Nama Perusahaan (PT) *</label>
                                <input 
                                    type="text" 
                                    className={`form-control ${errors.nama_perusahaan ? 'is-invalid' : ''}`}
                                    value={data.nama_perusahaan} 
                                    onChange={e => setData('nama_perusahaan', e.target.value)} 
                                    required 
                                />
                                {errors.nama_perusahaan && <div className="invalid-feedback">{errors.nama_perusahaan}</div>}
                            </div>
                            <div className="col-12 mt-4">
                                <label className="form-label">Logo Aplikasi</label>
                                <div className="d-flex align-items-center gap-3">
                                    {pengaturan?.logo && !data.remove_logo ? (
                                        <div className="position-relative" style={{width: '100px', height: '100px', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden'}}>
                                            <img src={`/storage/${pengaturan.logo}`} alt="Logo" style={{width: '100%', height: '100%', objectFit: 'contain'}} />
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                onClick={() => setData('remove_logo', true)}
                                            >
                                                <i className="bx bx-trash"></i>
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center" style={{width: '100px', height: '100px', border: '1px dashed #ccc', borderRadius: '8px', background: '#f8f9fa'}}>
                                            <i className="bx bx-image" style={{fontSize: '2rem', color: '#adb5bd'}}></i>
                                        </div>
                                    )}
                                    <div className="flex-grow-1">
                                        <input 
                                            type="file" 
                                            className={`form-control ${errors.logo ? 'is-invalid' : ''}`} 
                                            accept="image/*"
                                            onChange={e => {
                                                setData('logo', e.target.files[0]);
                                                setData('remove_logo', false);
                                            }}
                                        />
                                        <small className="text-muted">Biarkan kosong jika tidak ingin mengubah logo. (Maks 2MB)</small>
                                        {errors.logo && <div className="invalid-feedback">{errors.logo}</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-top text-end">
                            <button type="submit" className="btn btn-primary" disabled={processing}>
                                {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
