<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Question;
use Illuminate\Http\Request;
use Response;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($survey_id)
    {
        return Question::where("survey_id", $survey_id)->paginate(5);
    }

    /**
     * Display the specified resource.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\Response
     */
    public function show($survey_id, $question_id)
    {       
        return Question::where('survey_id', $survey_id)->where('id', $question_id)->first();
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
        return response()->json(tap(new Question($request->all()), function ($question) {
            $question->save();
        }), 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  Integer  $survey_id
     * @param  \App\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $survey_id, Question $question)
    {       
        $this->validator($request);
        return tap($question)->update($request->all());
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
            'survey_id' => 'required',
            'body' => 'required',
            // 'group' => '',
            'order' => 'required',
            'type' => 'required',
        ], [
            'type_id.*' => __('users.invalid_user_type'),
        ]);
    }
}
