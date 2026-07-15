<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userLevel = (string) $request->user()->level;

        // Map level numbers to role names
        $levelMap = ['1' => 'atasan', '2' => 'admin', '3' => 'driver'];
        $userRole = $levelMap[$userLevel] ?? 'unknown';

        if (!in_array($userRole, $roles) && !in_array($userLevel, $roles)) {
            // Redirect to appropriate dashboard based on role
            return match($userLevel) {
                '1' => redirect()->route('atasan.dashboard'),
                '2' => redirect()->route('admin.dashboard'),
                '3' => redirect()->route('driver.dashboard'),
                default => redirect()->route('login'),
            };
        }

        return $next($request);
    }
}
