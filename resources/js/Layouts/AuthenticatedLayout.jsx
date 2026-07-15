import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';

export default function AuthenticatedLayout({ children }) {
    const { auth, notifikasi_count, flash } = usePage().props;
    const user = auth.user;

    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkTheme = localStorage.getItem('theme') === 'dark';
        setIsDarkMode(darkTheme);
        if (darkTheme) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    }, []);

    const toggleDarkMode = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    return (
        <div className="layout-wrapper layout-content-navbar">
            <div className="layout-container">
                <Sidebar user={user} />

                <div className="layout-page">
                    {/* Navbar */}
                    <nav className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
                        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                            <a className="nav-item nav-link px-0 me-xl-4" href="#">
                                <i className="bx bx-menu bx-sm"></i>
                            </a>
                        </div>

                        <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                            <span className="badge bg-label-primary me-2 d-none d-md-inline">
                                {user.level === 1 ? 'Atasan' : user.level === 2 ? 'Admin' : 'Driver'}
                            </span>

                            <ul className="navbar-nav flex-row align-items-center ms-auto">
                                <li className="nav-item me-2">
                                    <button className="nav-link btn btn-link px-0 text-muted" onClick={toggleDarkMode}>
                                        <i className={`bx bx-sm ${isDarkMode ? 'bx-sun' : 'bx-moon'}`}></i>
                                    </button>
                                </li>

                                <li className="nav-item me-2">
                                    <a className="nav-link position-relative text-muted" href="/notifikasi">
                                        <i className="bx bx-bell bx-sm"></i>
                                        {notifikasi_count > 0 && (
                                            <span className="badge rounded-pill bg-danger badge-notifications">
                                                {notifikasi_count}
                                            </span>
                                        )}
                                    </a>
                                </li>

                                <li className="nav-item navbar-dropdown dropdown-user dropdown">
                                    <a className="nav-link dropdown-toggle hide-arrow" href="#" data-bs-toggle="dropdown">
                                        <div className="avatar avatar-online d-flex align-items-center justify-content-center bg-primary rounded-circle text-white">
                                            <i className="bx bx-user" style={{ fontSize: '1.2rem' }}></i>
                                        </div>
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <a className="dropdown-item" href="#">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0 me-3">
                                                        <div className="avatar avatar-online d-flex align-items-center justify-content-center bg-primary rounded-circle text-white" style={{ width: '40px', height: '40px' }}>
                                                            <i className="bx bx-user" style={{ fontSize: '1.2rem' }}></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <span className="fw-semibold d-block">{user.name}</span>
                                                        <small className="text-muted">{user.username}</small>
                                                    </div>
                                                </div>
                                            </a>
                                        </li>
                                        <li><div className="dropdown-divider"></div></li>
                                        <li>
                                            <Link href={route('logout')} method="post" as="button" className="dropdown-item">
                                                <i className="bx bx-power-off me-2"></i>
                                                <span className="align-middle">Log Out</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <div className="content-wrapper">
                        <div className="container-xxl flex-grow-1 container-p-y">
                            {flash?.success && (
                                <div className="alert alert-success alert-dismissible mb-4" role="alert">
                                    <i className="bx bx-check-circle me-2"></i>
                                    {flash.success}
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            )}
                            {flash?.error && (
                                <div className="alert alert-danger alert-dismissible mb-4" role="alert">
                                    <i className="bx bx-error-circle me-2"></i>
                                    {flash.error}
                                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                                </div>
                            )}
                            {children}
                        </div>
                        <div className="content-backdrop fade"></div>
                    </div>
                </div>
            </div>
            <div className="layout-overlay layout-menu-toggle"></div>
        </div>
    );
}
