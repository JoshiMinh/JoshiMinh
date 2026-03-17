<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class CartManager
{
    public function parse(?string $raw): array
    {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return [];
        }

        $items = [];
        $allowedTables = $this->allowedTables();

        foreach (preg_split('/\s+/', $raw) as $entry) {
            [$table, $id, $quantity] = array_pad(explode('-', $entry, 3), 3, null);
            if (
                $table &&
                in_array($table, $allowedTables, true) &&
                ctype_digit((string) $id) &&
                ctype_digit((string) $quantity)
            ) {
                $items[] = [
                    'table' => $table,
                    'id' => (int) $id,
                    'quantity' => (int) $quantity,
                ];
            }
        }

        return $items;
    }

    public function stringify(array $items): string
    {
        return collect($items)
            ->filter(fn ($item) => $item['quantity'] > 0)
            ->map(fn ($item) => $item['table'].'-'.$item['id'].'-'.$item['quantity'])
            ->implode(' ');
    }

    public function setCart(User $user, array $items): void
    {
        $normalized = collect($items)
            ->filter(fn ($item) => in_array($item['table'], $this->allowedTables(), true) && $item['quantity'] > 0)
            ->map(fn ($item) => [
                'table' => $item['table'],
                'id' => (int) $item['id'],
                'quantity' => (int) $item['quantity'],
            ])
            ->values()
            ->all();

        $user->forceFill(['cart' => $this->stringify($normalized)])->save();
    }

    public function calculateTotal(array $items): int
    {
        return collect($items)->sum(function ($item) {
            if (! in_array($item['table'], $this->allowedTables(), true)) {
                return 0;
            }

            $price = DB::table($item['table'])->where('id', $item['id'])->value('price');

            return ((int) $price) * $item['quantity'];
        });
    }

    public function expandItems(array $items): array
    {
        return collect($items)
            ->filter(fn ($item) => in_array($item['table'], $this->allowedTables(), true))
            ->map(function ($item) {
                $record = DB::table($item['table'])->where('id', $item['id'])->first();
                if (! $record) {
                    return null;
                }

                return [
                    'table' => $item['table'],
                    'id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'name' => $record->name,
                    'price' => (int) ($record->price ?? 0),
                    'image' => $record->image,
                    'brand' => $record->brand ?? null,
                ];
            })
            ->filter()
            ->values()
            ->all();
    }

    public function addItem(User $user, string $table, int $id, int $quantity = 1): void
    {
        if (! in_array($table, $this->allowedTables(), true)) {
            return;
        }

        $items = $this->parse($user->cart);
        $found = false;

        foreach ($items as &$item) {
            if ($item['table'] === $table && $item['id'] === $id) {
                $item['quantity'] = max(1, $item['quantity'] + $quantity);
                $found = true;
                break;
            }
        }
        unset($item);

        if (! $found) {
            $items[] = [
                'table' => $table,
                'id' => $id,
                'quantity' => max(1, $quantity),
            ];
        }

        usort($items, fn ($a, $b) => strcmp($a['table'].'-'.$a['id'], $b['table'].'-'.$b['id']));

        $this->setCart($user, $items);
    }

    private function allowedTables(): array
    {
        return collect(Config::get('categories', []))->values()->all();
    }
}
