# Sistem Manajemen Keuangan Operasional

A comprehensive operational and financial management system built for transportation and logistics operations.

## Technology Stack

- Backend: Laravel 11
- Frontend: React.js & Inertia.js
- Styling: Bootstrap 5 (Sneat Template)
- Database: MySQL / PostgreSQL

## Core Features

- **Role-Based Access Control (RBAC)**: Secure access separation for Administrator, Supervisor (Atasan), and Drivers.
- **Operational Dispatching**: Automated travel order generation and driver assignment.
- **Financial Tracking**: Real-time calculation of transportation costs, customer pricing, and net profit (Orderan).
- **Driver Portal**: Simplified dashboard for drivers to accept orders, input travel data, and upload physical proofs.
- **Verification Workflow**: Integrated approval system for financial reports by supervisors.
- **Dynamic System Configuration**: Easily customizable application identity and branding.

## System Requirements

- PHP >= 8.2
- Node.js >= 18.0
- Composer
- MySQL >= 8.0 or PostgreSQL

## Installation Guide

Follow these steps to set up the application in a local development environment.

### 1. Repository Clone
Clone the repository and navigate into the project directory.
```bash
git clone https://github.com/andretantri/driver-tracker.git
cd driver-tracker
```

### 2. Dependency Installation
Install PHP and Node.js dependencies.
```bash
composer install
npm install
```

### 3. Environment Configuration
Copy the environment file and generate the application key.
```bash
cp .env.example .env
php artisan key:generate
```
Configure your database credentials in the `.env` file:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=driver_tracker_db
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Database Migration & Seeding
Run the database migrations and seed the initial administrative data.
```bash
php artisan migrate
php artisan db:seed
```

### 5. Storage Link
Create a symbolic link for file storage to ensure uploaded proofs and logos are accessible.
```bash
php artisan storage:link
```

### 6. Asset Compilation
Build the frontend assets for production.
```bash
npm run build
```

### 7. Application Server
Start the local development server.
```bash
php artisan serve
```

The application will be accessible at `http://127.0.0.1:8000`.

## Default Access Credentials

- **Administrator**: username `admin` | password `password`
- **Supervisor (Atasan)**: username `atasan` | password `password`
- **Driver**: username `dwi` | password `password`

## License

Proprietary Software. All rights reserved.
