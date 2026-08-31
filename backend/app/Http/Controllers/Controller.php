<?php

namespace App\Http\Controllers;

use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
// use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Storage;

abstract class Controller 
// extends BaseController
{
    //
    // use AuthorizesRequests, ValidatesRequests;

    // public function storeImage(UploadedFile $image, string $folder):string {
    //     $filename = time().'.'.$image->getClientOriginalExtension();
    //     Storage::disk('website')->putFileAs($folder, $image, $filename);
    //     return "{$folder}/{$filename}";
    // }
}
