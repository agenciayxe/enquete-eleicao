<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{

    protected $casts = [];

    protected $fillable = [
        'question_id',
        'body',   
        'image',
        'justify',     
        'order',
    ];

}
