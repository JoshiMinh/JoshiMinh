<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function show(Request $request, string $table)
    {
        $categoryMap = Config::get('categories', []);
        $categoryName = collect($categoryMap)->search($table);

        if ($categoryName === false) {
            abort(404);
        }

        $brandFilter = (array) $request->input('brands', []);
        $minPrice = $this->sanitizePrice($request->input('min_price'));
        $maxPrice = $this->sanitizePrice($request->input('max_price'));

        $query = DB::table($table);

        $priceRange = $query->selectRaw('MIN(price) as min_price, MAX(price) as max_price')->first();
        $minPrice ??= (int) ($priceRange->min_price ?? 0);
        $maxPrice ??= (int) ($priceRange->max_price ?? 0);

        $brandList = DB::table($table)
            ->select('brand')
            ->whereNotNull('brand')
            ->distinct()
            ->orderBy('brand')
            ->pluck('brand');

        $itemsQuery = DB::table($table)
            ->select('*', DB::raw("'$table' as item_table"))
            ->whereBetween('price', [$minPrice, $maxPrice]);

        if (! empty($brandFilter)) {
            $itemsQuery->whereIn('brand', $brandFilter);
        }

        $sort = $request->string('sort');
        if ($sort->value() === 'highest') {
            $itemsQuery->orderByDesc('price');
        } elseif ($sort->value() === 'cheapest') {
            $itemsQuery->orderBy('price');
        } else {
            $itemsQuery->orderBy('brand');
        }

        $items = $itemsQuery->get();

        return view('categories.show', [
            'table' => $table,
            'categoryName' => $categoryName,
            'items' => $items,
            'brands' => $brandList,
            'selectedBrands' => $brandFilter,
            'minPrice' => $minPrice,
            'maxPrice' => $maxPrice,
            'sort' => $sort->value(),
        ]);
    }

    private function sanitizePrice($value): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (int) preg_replace('/[^\d]/', '', (string) $value);
    }
}
