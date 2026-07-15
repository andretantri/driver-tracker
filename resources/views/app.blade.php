<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="light-style customizer-hide" dir="ltr" data-theme="theme-default" data-assets-path="/sneat-assets/" data-template="vertical-menu-template-free">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

        <title inertia>{{ config('app.name', 'SPT Driver') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />

        <!-- Icons -->
        <link rel="stylesheet" href="/sneat-assets/vendor/fonts/boxicons.css" />

        <!-- Core CSS -->
        <link rel="stylesheet" href="/sneat-assets/vendor/css/core.css" class="template-customizer-core-css" />
        <link rel="stylesheet" href="/sneat-assets/vendor/css/theme-default.css" class="template-customizer-theme-css" />
        <link rel="stylesheet" href="/sneat-assets/css/demo.css" />

        <!-- Vendors CSS -->
        <link rel="stylesheet" href="/sneat-assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />

        <!-- Page CSS -->
        <link rel="stylesheet" href="/sneat-assets/vendor/css/pages/page-auth.css" />

        <!-- Helpers -->
        <script src="/sneat-assets/vendor/js/helpers.js"></script>
        <!-- Config -->
        <script src="/sneat-assets/js/config.js"></script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body>
        @inertia

        <!-- Core JS -->
        <script src="/sneat-assets/vendor/libs/jquery/jquery.js"></script>
        <script src="/sneat-assets/vendor/libs/popper/popper.js"></script>
        <script src="/sneat-assets/vendor/js/bootstrap.js"></script>
        <script src="/sneat-assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>
        <script src="/sneat-assets/vendor/js/menu.js"></script>

        <!-- Main JS -->
        <script src="/sneat-assets/js/main.js"></script>
    </body>
</html>
