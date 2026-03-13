<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class ItemController extends Controller
{
    public function show(string $table, int $id): View
    {
        $this->guardTable($table);

        $item = DB::table($table)->where('id', $id)->first();
        abort_if(! $item, 404);

        $ratings = $this->parseRatings($item->ratings ?? '');
        $userId = Auth::id();
        $userRating = $userId ? ($ratings[$userId] ?? null) : null;
        $averageRating = $this->calculateAverageRating($ratings);

        $comments = DB::table('comments')
            ->join('users', 'comments.user_id', '=', 'users.id')
            ->where('comments.product_table', $table)
            ->where('comments.product_id', $id)
            ->orderByDesc('comments.comment_id')
            ->get([
                'comments.content',
                'comments.time',
                'users.name',
                'users.profile_image',
            ]);

        return view('items.show', [
            'table' => $table,
            'item' => $item,
            'comments' => $comments,
            'userRating' => $userRating,
            'averageRating' => $averageRating,
            'ratingCount' => count($ratings),
        ]);
    }

    public function store(Request $request, string $table, int $id): RedirectResponse
    {
        $this->guardTable($table);
        $item = DB::table($table)->where('id', $id)->first();
        abort_if(! $item, 404);

        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        if ($request->filled('comment')) {
            DB::table('comments')->insert([
                'user_id' => $user->id,
                'product_id' => $id,
                'product_table' => $table,
                'content' => trim($request->input('comment')),
                'time' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if ($request->filled('rating')) {
            $rating = max(1, min(5, (int) $request->input('rating')));
            $ratings = $this->parseRatings($item->ratings ?? '');
            $ratings[$user->id] = $rating;

            DB::table($table)->where('id', $id)->update([
                'ratings' => $this->stringifyRatings($ratings),
            ]);
        }

        return back();
    }

    private function guardTable(string $table): void
    {
        $allowed = collect(Config::get('categories', []))->values();
        if (! $allowed->contains($table)) {
            abort(404);
        }
    }

    /**
     * @return array<int, int>
     */
    private function parseRatings(string $raw): array
    {
        $ratings = [];
        foreach (preg_split('/\s+/', trim($raw)) as $entry) {
            if ($entry === '') {
                continue;
            }

            [$userId, $rating] = array_pad(explode('-', $entry, 2), 2, null);
            if ($userId !== null && $rating !== null) {
                $ratings[(int) $userId] = (int) $rating;
            }
        }

        return $ratings;
    }

    private function stringifyRatings(array $ratings): string
    {
        return collect($ratings)
            ->map(fn ($rating, $userId) => $userId.'-'.$rating)
            ->implode(' ');
    }

    private function calculateAverageRating(array $ratings): float
    {
        if ($ratings === []) {
            return 0.0;
        }

        return array_sum($ratings) / count($ratings);
    }
}
