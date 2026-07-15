import { Head, useForm, usePage } from '@inertiajs/react';

export default function Login({ status }) {
    const { pengaturan } = usePage().props;
    const appName = pengaturan?.nama_aplikasi || 'Sistem Manajemen Keuangan';
    const ptName = pengaturan?.nama_perusahaan || 'PT Sukarno Putro Trans';
    
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title={`Login — ${ptName}`} />
            <div className="container-xxl">
                <div className="authentication-wrapper authentication-basic container-p-y">
                    <div className="authentication-inner">
                        <div className="card">
                            <div className="card-body">
                                <div className="app-brand justify-content-center mb-3">
                                    <a href="#" className="app-brand-link gap-2 align-items-center">
                                        <span className="app-brand-logo demo text-primary">
                                            {pengaturan?.logo ? (
                                                <img src={`/storage/${pengaturan.logo}`} height="60px" alt={`${ptName} Logo`} />
                                            ) : (
                                                <i className="bx bxs-truck" style={{fontSize: '3rem'}}></i>
                                            )}
                                        </span>
                                    </a>
                                </div>
                                <h4 className="mb-1 text-center fw-bold">{ptName}</h4>
                                <p className="mb-4 text-center text-muted" style={{fontSize: '13px'}}>
                                    {appName}
                                </p>

                                {status && (
                                    <div className="alert alert-success" role="alert">{status}</div>
                                )}
                                {errors.username && (
                                    <div className="alert alert-danger" role="alert">{errors.username}</div>
                                )}
                                {errors.password && (
                                    <div className="alert alert-danger" role="alert">{errors.password}</div>
                                )}

                                <form id="formLogin" className="mb-3" onSubmit={submit}>
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            name="username"
                                            placeholder="Masukkan username"
                                            value={data.username}
                                            autoFocus
                                            required
                                            onChange={(e) => setData('username', e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3 form-password-toggle">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <div className="input-group input-group-merge">
                                            <input
                                                type="password"
                                                id="password"
                                                className="form-control"
                                                name="password"
                                                placeholder="············"
                                                required
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                            <span className="input-group-text cursor-pointer"><i className="bx bx-hide"></i></span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <button className="btn btn-primary d-grid w-100" type="submit" disabled={processing}>
                                            {processing ? 'Memproses...' : 'Masuk'}
                                        </button>
                                    </div>
                                </form>
                                <p className="text-center text-muted" style={{fontSize: '12px'}}>
                                    © {new Date().getFullYear()} {ptName}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
