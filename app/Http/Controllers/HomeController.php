<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Util\Utils;
use Auth;

class HomeController extends Controller
{
    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('app');
    }

     /**
     * Show the survey.
     *
     * @param String $slug
     * @return \Illuminate\Http\Response
     */
    public function participate($slug)
    {
        $survey = \App\Survey::where('slug', $slug)->first();

        return view('participate', [ 'survey' => $survey ]);
    }

    /**
     * Get initial data for Vue.js application
     */
    public function vue()
    {
        $homeItems = [
            [
                'name' => 'strings.users',
                'icon' => 'users',
                'link' => 'users',
            ],
            [
                'name' => 'strings.surveys',
                'icon' => 'question-circle',
                'link' => '/p/surveys',
            ]
        ];

        $settingsFile = Utils::getSettingsFile();

        $settings = array();

        if (file_exists($settingsFile)) {
            $settings = json_decode(file_get_contents($settingsFile));
        }

        $data = [
            'homeItems' => $homeItems,
            'settings' => $settings,
        ];

        return $data;
    }
}
