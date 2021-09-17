<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Survey extends Model
{

    protected $casts = [];

    protected $fillable = [
        'afterword',
        'cover',
        'description',
        'execution',
        'due_at',
        'final_sound',
        'introduction',
        'name',
        'unique',
    ];

    public static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            $model->slug = Str::slug($model->name);
        });
    }

    function questions() {
        return $this->hasMany('\App\Question', 'survey_id');
    }
}
