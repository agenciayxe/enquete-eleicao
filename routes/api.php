<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'namespace' => 'Auth',
    'prefix' => 'auth',
], function () {
    Route::post('login', 'AuthController@login');
    Route::post('logout', 'AuthController@logout');
    Route::post('refresh', 'AuthController@refresh');
    Route::get('user', 'AuthController@user');

    Route::post('register', 'RegisterController@register');
});

Route::group([
    'middleware' => ['jwt.auth'],
], function () {
    Route::get('vue', 'HomeController@vue');

    Route::post('settings', 'SettingController@saveSettings');
});

Route::get('participate/{survey_slug}', 'ParticipateController@index');
Route::post('participate/{survey_slug}', 'ParticipateController@store');
Route::get('home', 'ParticipateController@surveys');
Route::post('images', 'Resources\ImageController@store');

Route::group([
    'middleware' => ['admin'],
], function () {    
    Route::get('surveys/{survey_id}/results', 'Resources\SurveyController@results');
    Route::resource('surveys', 'Resources\SurveyController', [
        'except' => ['create', 'edit'],
    ]);
    Route::resource('surveys/{survey_id}/questions', 'Resources\QuestionController', [
        'except' => ['create', 'edit'],
    ]);
    Route::resource('surveys/{survey_id}/questions/{question_id}/answers', 'Resources\AnswerController', [
        'except' => ['create', 'edit'],
    ]);
    Route::resource('users', 'Resources\UserController', [
        'except' => ['create', 'edit', 'show'],
    ]);
});

Route::any('messages/{type}/{id}', function ($type, $id) {
    $data = array(
       'text' => rand(),
       'message' => 'When you reload this page, it will send a broadcast notification via Pusher, adding a random number on the other tab.',
    );

    if ($type === 'private') {
        $user = \App\User::findOrFail($id);
        $user->notify(new \App\Notifications\PrivateMessageNotification($data));
    } else {
        event(new \App\Events\PublicMessagePusherEvent($data));
    }

    return response()->json($data);
});
