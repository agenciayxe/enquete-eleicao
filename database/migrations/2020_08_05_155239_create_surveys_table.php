<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSurveysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('surveys', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('afterword')->nullable();
            $table->string('cover')->nullable();
            $table->string('description')->nullable();
            $table->integer('execution')->default(1);
            $table->string('final_sound')->nullable();
            $table->string('name');
            $table->text('introduction')->nullable();
            $table->string('slug');
            $table->integer('type');
            $table->boolean('unique')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('surveys');
    }
}
