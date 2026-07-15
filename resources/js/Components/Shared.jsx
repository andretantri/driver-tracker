// Helper: format number as Rupiah
export const formatRupiah = (value) => {
    if (!value && value !== 0) return '-';
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

// Status badge for perintah status
export const StatusBadge = ({ status }) => {
    const map = {
        pending:    { cls: 'bg-label-warning',  label: 'Menunggu' },
        diterima:   { cls: 'bg-label-info',     label: 'Diterima' },
        berjalan:   { cls: 'bg-label-primary',  label: 'Berjalan' },
        selesai:    { cls: 'bg-label-success',  label: 'Selesai' },
        dibatalkan: { cls: 'bg-label-danger',   label: 'Dibatalkan' },
    };
    const s = map[status] || { cls: 'bg-label-secondary', label: status };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

// Status verifikasi badge
export const StatusVerifBadge = ({ status }) => {
    const map = {
        pending:       { cls: 'bg-label-warning', label: 'Menunggu Verifikasi' },
        diverifikasi:  { cls: 'bg-label-success', label: 'Diverifikasi' },
        ditolak:       { cls: 'bg-label-danger',  label: 'Ditolak' },
    };
    if (!status) return null;
    const s = map[status] || { cls: 'bg-label-secondary', label: status };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
};

// Empty state component
export const EmptyState = ({ message = 'Tidak ada data.' }) => (
    <div className="text-center py-5 text-muted">
        <i className="bx bx-inbox" style={{ fontSize: '3rem' }}></i>
        <p className="mt-2">{message}</p>
    </div>
);

// Pagination component
export const Pagination = ({ links }) => {
    if (!links || links.length <= 3) return null;
    return (
        <nav className="d-flex justify-content-end mt-3">
            <ul className="pagination pagination-sm mb-0">
                {links.map((link, i) => (
                    <li key={i} className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}>
                        <a
                            className="page-link"
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};
