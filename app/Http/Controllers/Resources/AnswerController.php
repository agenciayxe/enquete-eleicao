<?php

namespace App\Http\Controllers\Resources;

use App\Answer;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Response;

class AnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @param  integer  $survey_id
     * @param  integer  $question_id
     * @return \Illuminate\Http\Response
     */
    public function index($survey_id, $question_id)
    {
        return Answer::where("question_id", $question_id)
            ->orderBy('order')
            ->paginate(5);
    }

    /**
     * Display the specified resource.
     *
     * @param  integer  $survey_id
     * @param  integer  $question_id
     * @param  integer  $answer_id
     * @return \Illuminate\Http\Response
     */
    public function show($survey_id, $question_id, $answer_id)
    {
        return Answer::where('question_id', $question_id)
            ->where('id', $answer_id)
            ->first();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validator($request);

        $data = $request->all();
        
        $image = null;
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('public/images');
            $data['image'] = $image;
        };

        return response()->json(tap(new Answer($data), function ($answer) {
            $answer->save();
        }), 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\User  $User
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $survey_id, $question_id, Answer $answer)
    {
        $this->validator($request);

        $data = $request->all();
        
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('public/images');
            $data['image'] = $image;
        };

        return tap($answer)->update($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\User  $User
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(null, 204);
    }

    private function validator(Request $request, $id = null)
    {
        $emailValidation = 'required|max:191|email|unique:users';

        if (!empty($id)) {
            $emailValidation .= ',email,' . $id;
        }

        $request->validate([
            'question_id' => 'required',
            'body' => 'required',
            // 'group' => '',
            'order' => 'required',
        ], [
            'type_id.*' => __('users.invalid_user_type'),
        ]);
    }
}
