<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username',
        'name',
        'email',
        'phone',
        'password',
        'level',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_active' => 'boolean',
            'level' => 'integer',
        ];
    }

    // Role helpers
    public function isAtasan(): bool { return $this->level === 1; }
    public function isAdmin(): bool  { return $this->level === 2; }
    public function isDriver(): bool { return $this->level === 3; }
    public function getLevelNameAttribute(): string
    {
        return match($this->level) {
            1 => 'Atasan',
            2 => 'Admin',
            3 => 'Driver',
            default => 'Unknown',
        };
    }

    // Relationships
    public function perintahSebagaiDriver()
    {
        return $this->hasMany(PerintahPerjalanan::class, 'driver_id');
    }

    public function perintahDibuat()
    {
        return $this->hasMany(PerintahPerjalanan::class, 'created_by');
    }

    public function notifikasi()
    {
        return $this->hasMany(Notifikasi::class);
    }

    public function notifikasiUnread()
    {
        return $this->hasMany(Notifikasi::class)->where('is_read', false);
    }
}
