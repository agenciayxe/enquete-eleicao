<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Vote extends Model
{

    protected $casts = [];

    protected $fillable = [
        'question_id',
        'ip',
        'session_id',
    ];
}
