<?php

namespace App\Http\Controllers;

use App\Services\BuildSetManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;

class HomeController extends Controller
{
    public function __construct(private readonly BuildSetManager $buildSetManager)
    {
    }

    public function __invoke(Request $request)
    {
        $user = Auth::user();
        $buildSet = $this->buildSetManager->resolve($user, $request);

        return view('builder.index', [
            'categoryMap' => Config::get('categories', []),
            'components' => $buildSet['components'],
            'totalAmount' => $buildSet['total'],
            'buildSetRaw' => $buildSet['raw'],
            'buildSetConflict' => $buildSet['conflict'],
            'hasLocalBuildSet' => $buildSet['hasLocal'],
            'hasRemoteBuildSet' => $buildSet['hasRemote'],
        ]);
    }
}
