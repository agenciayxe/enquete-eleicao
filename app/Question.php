<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{

    protected $casts = [];

    protected $fillable = [
        'survey_id',
        'body',
        'group',
        'order',
        'type',
    ];

    function answers() {
        return $this->hasMany('\App\Answer', 'question_id');
    }
    
}
