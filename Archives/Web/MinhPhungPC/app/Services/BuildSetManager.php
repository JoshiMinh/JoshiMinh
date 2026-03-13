<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Contracts\Cookie\Factory as CookieFactory;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class BuildSetManager
{
    public function __construct(private readonly CookieFactory $cookies)
    {
    }

    public function resolve(User $user = null, Request $request): array
    {
        $cookieValue = $request->cookie('buildset');
        $databaseValue = $user?->buildset;

        $conflict = $user && $cookieValue && $cookieValue !== $databaseValue;

        $raw = $databaseValue ?? $cookieValue ?? '';
        $components = $this->hydrateComponents($raw);

        return [
            'raw' => $raw,
            'components' => $components,
            'total' => $this->calculateTotal($components),
            'conflict' => $conflict,
            'hasLocal' => (bool) $cookieValue,
            'hasRemote' => (bool) $databaseValue,
        ];
    }

    public function replaceWithCookie(User $user, Request $request): void
    {
        $cookieValue = $request->cookie('buildset');
        if (! $user || ! $cookieValue) {
            return;
        }

        $user->forceFill(['buildset' => $cookieValue])->save();
        $this->cookies->queue($this->cookies->forget('buildset'));
    }

    public function discardCookie(): void
    {
        $this->cookies->queue($this->cookies->forget('buildset'));
    }

    public function updateComponent(string $table, int $id, User $user = null, Request $request = null): array
    {
        $buildset = $this->parseBuildSet($user?->buildset ?? $request?->cookie('buildset'));
        $buildset[$table] = $id;

        return $this->persist($buildset, $user);
    }

    public function removeComponent(string $table, User $user = null, Request $request = null): array
    {
        $buildset = $this->parseBuildSet($user?->buildset ?? $request?->cookie('buildset'));
        unset($buildset[$table]);

        return $this->persist($buildset, $user);
    }

    public function clear(User $user = null): void
    {
        if ($user) {
            $user->forceFill(['buildset' => null])->save();
        } else {
            $this->cookies->queue($this->cookies->forget('buildset'));
        }
    }

    public function persist(array $buildset, User $user = null): array
    {
        ksort($buildset);
        $raw = $this->stringifyBuildSet($buildset);

        if ($user) {
            $user->forceFill(['buildset' => $raw])->save();
            $this->cookies->queue($this->cookies->forget('buildset'));
        } else {
            $this->cookies->queue('buildset', $raw, 60 * 24 * 30);
        }

        $components = $this->hydrateComponents($raw);

        return [
            'raw' => $raw,
            'components' => $components,
            'total' => $this->calculateTotal($components),
        ];
    }

    public function parseBuildSet(?string $raw): array
    {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return [];
        }

        $entries = preg_split('/\s+/', $raw);

        $buildset = [];
        $allowedTables = collect(Config::get('categories', []))->values();

        foreach ($entries as $entry) {
            [$table, $id] = array_pad(explode('-', $entry, 2), 2, null);
            if ($table && $allowedTables->contains($table) && ctype_digit((string) $id)) {
                $buildset[$table] = (int) $id;
            }
        }

        return $buildset;
    }

    public function stringifyBuildSet(array $buildset): string
    {
        return collect($buildset)
            ->map(fn ($id, $table) => $table.'-'.$id)
            ->implode(' ');
    }

    public function hydrateComponents(string $raw): array
    {
        $buildset = $this->parseBuildSet($raw);

        return collect($buildset)
            ->map(function (int $id, string $table) {
                $component = DB::table($table)->where('id', $id)->first();
                if (! $component) {
                    return null;
                }

                return [
                    'table' => $table,
                    'id' => $id,
                    'name' => $component->name ?? 'Unknown',
                    'price' => (int) ($component->price ?? 0),
                    'image' => $component->image ?? null,
                    'brand' => $component->brand ?? null,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    private function calculateTotal(array $components): int
    {
        return collect($components)->sum(fn ($component) => Arr::get($component, 'price', 0));
    }
}
