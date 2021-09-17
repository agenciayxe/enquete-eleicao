<?php

namespace App\Http\Controllers;

use App\Survey;
use App\Vote;
use Illuminate\Http\Request;

class ParticipateController extends Controller
{
    /**
     * Show the Survey.
     * 
     * @param \Illuminate\Http\Request $request
     * @param String $survey_slug
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $survey_slug)
    {
        $data = [];

        $survey = Survey::with(['questions.answers'])
            ->where('slug', $survey_slug)
            ->first();
        
        if(!$survey) return response(null, 404);
        
        $voted = !!Vote::join('answers', 'answer_id', '=', 'answers.id')
            ->join('questions', 'question_id', '=', 'questions.id')
            ->where('survey_id', $survey->id)
            ->where('ip', $request->ip())
            ->first();
            
        $expired = false;        
        if($survey->due_at) {
            $due = new \DateTime($survey->due_at);
            $today = new \DateTime(date('Y-m-d'));
            $expired = $due <= $today;
            $data['expired'] = $expired;            
        }

        $data['result'] = [];
        if($voted || $expired) {
            $votes = Vote::select([
                    'questions.body as question',
                    'answers.body as answer',
                    'answer_id',
                    \DB::raw('count(`answer_id`) as `votes`')
                ])
                ->join('answers', 'answers.id', '=', 'answer_id')
                ->join('questions', 'questions.id', '=', 'question_id')
                ->join('surveys', 'surveys.id', '=', 'survey_id')
                ->where('surveys.id', $survey->id)
                ->groupBy('questions.body', 'answers.body', 'answer_id', 'answer_id')
                ->get();
            $data['result'] = $votes;
        }

        $data['survey'] = $survey;
        $data['voted'] = $voted;
        return $data;
    }

    /**
     * Store the Survey Votes.
     * 
     * @param String $survey_slug
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $survey_slug)
    {
        $this->validator($request);

        $survey = Survey::where('slug', $survey_slug)->first();
         
        if(!$survey) return response(null, 400);
              
        if($survey->due_at) {
            $due = new \DateTime($survey->due_at);
            $today = new \DateTime(date('Y-m-d'));
            $expired = $due <= $today;
            if($expired) return response(null, 403);
        }
        
        if($survey->unique) {
            $voted = !!Vote::join('answers', 'answer_id', '=', 'answers.id')
            ->join('questions', 'question_id', '=', 'questions.id')
            ->where('survey_id', $survey->id)
            ->where('ip', $request->ip())
            ->first();
            if($voted) return response(null, 403);
        }
    
        $data = $request->all();
        $data['ip'] = $request->ip();          

        $votes = array_map(function($row) use($data) {
            $vote = new Vote;
            $vote->answer_id = $row['answer_id'];
            $vote->session_id = $data['session_id'];
            $vote->body = @$row['body'];
            $vote->ip = $data['ip'];
            $vote->save();
            return $vote;
        }, $request->input('votes'));

        return $votes;
    }

     /**
     * Show the Survey.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function surveys(Request $request)
    {
        $surveys = Survey::orderBy('created_at', 'desc')
            ->take(25)
            ->get();
        return response()->json($surveys);
    }

    private function validator(Request $request)
    {      
        $request->validate([
            'session_id' => 'required',
            'votes.*.answer_id' => 'required'
        ]);
    }

}
