<?php

namespace App\Http\Controllers\Resources;

use App\Http\Controllers\Controller;
use App\Survey;
use App\Vote;
use Illuminate\Http\Request;
use Response;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Survey::paginate(5);
    }

    /**
     * Display the specified resource.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\Response
     */
    public function results($id)
    {
        $survey = Survey::with(['questions' => function ($query) {$query->orderBy('order');}])
            ->where('id', $id)
            ->first();

        $survey->votes = Vote::select([
            'questions.body as question',
            'answers.body as answer',
            'answer_id',
            \DB::raw('count(`answer_id`) as `votes`'),
        ])
            ->join('answers', 'answers.id', '=', 'answer_id')
            ->join('questions', 'questions.id', '=', 'question_id')
            ->join('surveys', 'surveys.id', '=', 'survey_id')
            ->where('surveys.id', $survey->id)
            ->groupBy('questions.body', 'answers.body', 'answer_id', 'answer_id')
            ->get();

        $survey->votes->each(function (&$vote) {
            $justifications = Vote::select([
                'body',
                \DB::raw('count(answer_id) as quantity'),
            ])
                ->where('answer_id', $vote->answer_id)
                ->whereNotNull('body')
                ->groupBy('body')
                ->get();
            if ($justifications) {
                $vote->justifications = $justifications;
            }

        });

        return response()->json($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  integer  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id, $all = false)
    {
        $survey = Survey::where('id', $id)->first();

        if (!$survey) {
            return response('', 404);
        }

        return response()->json($survey);
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

        if ($request->hasFile('cover')) {
            $cover = $request->file('cover')->store('public/images');
            $data['cover'] = str_replace('public', 'storage', $cover);
        }

        if ($request->hasFile('final_sound')) {
            $final_sound = $request->file('final_sound')->store('public/sounds');
            $data['final_sound'] = str_replace('public', 'storage', $final_sound);
        }

        return response()->json(tap(new Survey($data), function ($survey) {
            $survey->save();
        }), 201);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Survey $survey)
    {
        $this->validator($request);

        $data = $request->all();

        if ($request->hasFile('cover')) {
            $cover = $request->file('cover')->store('public/images');
            $data['cover'] = str_replace('public', 'storage', $cover);
        }

        if ($request->hasFile('final_sound')) {
            $final_sound = $request->file('final_sound')->store('public/sounds');
            $data['final_sound'] = str_replace('public', 'storage', $final_sound);
        }

        return tap($survey)->update($data);
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

    private function validator(Request $request)
    {
        $name = ['required', 'max:191'];

        if (!empty($request->input('id'))) {
            $emailValidation[] = 'unique:surveys,' . $request->input('id');
        }

        $request->validate([
            'name' => $name,
        ]);
    }
}
