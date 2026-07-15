import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Sidebar({ user }) {
    const [openMenu, setOpenMenu] = useState('');
    const { url } = usePage();

    const toggleMenu = (menuName, e) => {
        e.preventDefault();
        setOpenMenu(openMenu === menuName ? '' : menuName);
    };

    const isActive = (path) => url === path || url.startsWith(path + '?');
    const isOpen = (paths) => paths.some(p => url.startsWith(p));

    const ptName = usePage().props.pengaturan?.nama_perusahaan || 'SPT Trans';
    const logo = usePage().props.pengaturan?.logo;

    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
                <a href="#" className="app-brand-link">
                    <span className="app-brand-logo demo text-primary">
                        {logo ? (
                            <img src={`/storage/${logo}`} height="40px" alt="Logo" />
                        ) : (
                            <i className="bx bxs-truck" style={{fontSize: '2rem'}}></i>
                        )}
                    </span>
                    <span className="app-brand-text demo menu-text fw-bolder ms-2" style={{ textTransform: 'uppercase', fontSize: '12px' }}>
                        {ptName}
                    </span>
                </a>
                <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>

            <div className="menu-inner-shadow"></div>

            <ul className="menu-inner py-1">
                {/* ── ADMIN (level 2) ── */}
                {user.level === 2 && (
                    <>
                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Menu Utama</span>
                        </li>
                        <li className={`menu-item ${isActive('/admin/dashboard') ? 'active' : ''}`}>
                            <Link href="/admin/dashboard" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-home-circle"></i>
                                <div>Dashboard</div>
                            </Link>
                        </li>

                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Master Data</span>
                        </li>
                        <li className={`menu-item ${isActive('/admin/kendaraan') ? 'active' : ''}`}>
                            <Link href="/admin/kendaraan" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-car"></i>
                                <div>Kendaraan</div>
                            </Link>
                        </li>
                        <li className={`menu-item ${isActive('/admin/driver') ? 'active' : ''}`}>
                            <Link href="/admin/driver" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-id-card"></i>
                                <div>Driver</div>
                            </Link>
                        </li>

                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Operasional</span>
                        </li>
                        <li className={`menu-item ${isActive('/admin/perintah') ? 'active' : ''}`}>
                            <Link href="/admin/perintah" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-send"></i>
                                <div>Perintah Perjalanan</div>
                            </Link>
                        </li>

                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Keuangan</span>
                        </li>
                        <li className={`menu-item ${isActive('/admin/laporan') ? 'active' : ''}`}>
                            <Link href="/admin/laporan" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-spreadsheet"></i>
                                <div>Laporan Keuangan</div>
                            </Link>
                        </li>

                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Sistem</span>
                        </li>
                        <li className={`menu-item ${isActive('/admin/pengaturan') ? 'active' : ''}`}>
                            <Link href="/admin/pengaturan" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-cog"></i>
                                <div>Pengaturan</div>
                            </Link>
                        </li>
                    </>
                )}

                {/* ── ATASAN (level 1) ── */}
                {user.level === 1 && (
                    <>
                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Menu Atasan</span>
                        </li>
                        <li className={`menu-item ${isActive('/atasan/dashboard') ? 'active' : ''}`}>
                            <Link href="/atasan/dashboard" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-home-circle"></i>
                                <div>Dashboard</div>
                            </Link>
                        </li>

                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Verifikasi & Laporan</span>
                        </li>
                        <li className={`menu-item ${isActive('/atasan/verifikasi') ? 'active' : ''}`}>
                            <Link href="/atasan/verifikasi" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-check-shield"></i>
                                <div>Verifikasi Laporan</div>
                            </Link>
                        </li>
                        <li className={`menu-item ${isActive('/atasan/laporan') ? 'active' : ''}`}>
                            <Link href="/atasan/laporan" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-bar-chart-alt-2"></i>
                                <div>Rekap Laporan</div>
                            </Link>
                        </li>
                    </>
                )}

                {/* ── DRIVER (level 3) ── */}
                {user.level === 3 && (
                    <>
                        <li className="menu-header small text-uppercase">
                            <span className="menu-header-text">Menu Driver</span>
                        </li>
                        <li className={`menu-item ${isActive('/driver/dashboard') ? 'active' : ''}`}>
                            <Link href="/driver/dashboard" className="menu-link">
                                <i className="menu-icon tf-icons bx bx-home-circle"></i>
                                <div>Dashboard</div>
                            </Link>
                        </li>
                    </>
                )}

                {/* Notifikasi - semua role */}
                <li className="menu-header small text-uppercase">
                    <span className="menu-header-text">Lainnya</span>
                </li>
                <li className={`menu-item ${isActive('/notifikasi') ? 'active' : ''}`}>
                    <Link href="/notifikasi" className="menu-link">
                        <i className="menu-icon tf-icons bx bx-bell"></i>
                        <div>Notifikasi</div>
                    </Link>
                </li>
            </ul>
        </aside>
    );
}
