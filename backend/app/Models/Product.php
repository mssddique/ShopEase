<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'slug',
        'sku',
        'description',
        'price',
        'sale_price',
        'stock',
        'image',
        'status',
        'featured',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
            'status' => 'boolean',
            'featured' => 'boolean',
        ];
    }

    // Relationships
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    // ...
    protected static function booted()
    {
        static::deleting(function (Product $product) {
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            foreach ($product->images as $img) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }
        });
    }

    // Helper: returns sale_price if set, otherwise price
    public function getFinalPriceAttribute()
    {
        return $this->sale_price ?? $this->price;
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
