<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Response;

class ImageController extends Controller
{    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
     
        if (!$request->hasFile('file')) return response(null, 400);
        $image = $request->file('file')->store('public/images');
        return response()->json(\URL::to('/').'/'.str_replace('public', 'storage', $image));
    }
}
