<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\View\View;

class SearchController extends Controller
{
    public function suggest(Request $request)
    {
        $query = trim($request->query('search', ''));
        if ($query === '') {
            return response()->json([]);
        }

        $components = [];
        foreach (Config::get('component_columns', []) as $table => $columns) {
            $results = DB::table($table)
                ->select('*', DB::raw("'$table' as item_table"))
                ->where(function ($q) use ($query) {
                    $q->where('name', 'like', '%' . $query . '%')
                        ->orWhere('brand', 'like', '%' . $query . '%');
                })
                ->orderBy('brand')
                ->limit(10)
                ->get();

            foreach ($results as $row) {
                $row->price = (int) ($row->price ?? 0);
                $components[] = $row;
            }
        }

        return response()->json($components);
    }

    public function results(Request $request): View
    {
        $query = trim($request->query('search', ''));
        $sort = $request->query('sort');

        $items = collect();
        if ($query !== '') {
            foreach (Config::get('component_columns', []) as $table => $columns) {
                $records = DB::table($table)
                    ->select('*', DB::raw("'$table' as item_table"))
                    ->where(function ($q) use ($query) {
                        $q->where('name', 'like', '%' . $query . '%')
                            ->orWhere('brand', 'like', '%' . $query . '%');
                    })
                    ->get();

                $items = $items->concat($records);
            }

            $items = $items->map(function ($item) {
                $item->price = (int) ($item->price ?? 0);
                return $item;
            });

            $sort = in_array($sort, ['highest', 'cheapest'], true) ? $sort : null;

            if ($sort === 'highest') {
                $items = $items->sortByDesc('price');
            } elseif ($sort === 'cheapest') {
                $items = $items->sortBy('price');
            } else {
                $items = $items->sortBy(function ($item) {
                    return Str::lower($item->brand ?? '');
                });
            }

            $items = $items->values();
        } else {
            $sort = null;
        }

        return view('search.results', [
            'query' => $query,
            'items' => $items,
            'sort' => $sort,
        ]);
    }
}
