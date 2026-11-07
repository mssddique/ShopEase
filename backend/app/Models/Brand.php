<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'status',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'status' => 'boolean',
        ];
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

        protected static function booted()
    {
        static::deleting(function (Brand $brand) {
            if ($brand->image) {
                Storage::disk('public')->delete($brand->image);
            }
        });
    }

    public function getImageUrlAttribute()
    {
        if (! $this->image) {
            return null;
        }
        if (str_starts_with($this->image, 'http://') || str_starts_with($this->image, 'https://')) {
            return $this->image;
        }
        return Storage::disk('public')->url($this->image);
    }
}