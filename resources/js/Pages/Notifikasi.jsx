import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Notifikasi({ notifikasi }) {
    const markAsRead = (id) => {
        router.patch(`/notifikasi/${id}/read`, {}, { preserveScroll: true });
    };

    const markAllAsRead = () => {
        router.patch('/notifikasi/read-all', {}, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Notifikasi" />

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0"><i className="bx bx-bell me-2"></i>Notifikasi</h4>
                {notifikasi.data.some(n => !n.is_read) && (
                    <button className="btn btn-sm btn-outline-primary" onClick={markAllAsRead}>
                        Tandai Semua Dibaca
                    </button>
                )}
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    {notifikasi.data.length > 0 ? (
                        <div className="list-group list-group-flush">
                            {notifikasi.data.map((n) => (
                                <div key={n.id} className={`list-group-item list-group-item-action p-3 ${!n.is_read ? 'bg-light' : ''}`}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h6 className="mb-1 fw-bold">{n.title}</h6>
                                            <p className="mb-1 text-muted" style={{fontSize: '14px'}}>{n.message}</p>
                                            <small className="text-secondary">{new Date(n.created_at).toLocaleString()}</small>
                                        </div>
                                        <div className="d-flex gap-2">
                                            {n.url && (
                                                <Link href={n.url} className="btn btn-sm btn-primary">
                                                    Lihat
                                                </Link>
                                            )}
                                            {!n.is_read && (
                                                <button className="btn btn-sm btn-outline-secondary" onClick={() => markAsRead(n.id)}>
                                                    Tandai Dibaca
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-5 text-muted">
                            <i className="bx bx-bell-off" style={{fontSize: '3rem'}}></i>
                            <p className="mt-2">Belum ada notifikasi.</p>
                        </div>
                    )}
                </div>
                {notifikasi.links && notifikasi.links.length > 3 && (
                    <div className="card-footer bg-white border-0 pt-3">
                        <nav>
                            <ul className="pagination justify-content-center mb-0">
                                {notifikasi.links.map((link, k) => (
                                    <li key={k} className={`page-item ${link.active ? 'active' : ''} ${link.url === null ? 'disabled' : ''}`}>
                                        <Link className="page-link" href={link.url || '#'} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
