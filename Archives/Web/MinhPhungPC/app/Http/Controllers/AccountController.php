<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View;

class AccountController extends Controller
{
    public function index(Request $request): View
    {
        $user = $request->user();

        $orders = DB::table('orders')
            ->where('customer_id', $user->id)
            ->orderByDesc('order_date')
            ->get();

        $orderItems = $this->buildOrderItemsMap($orders->all());

        return view('account.index', [
            'user' => $user,
            'orders' => $orderItems,
        ]);
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validateWithBag('profile', [
            'name' => ['required', 'string', 'max:255', Rule::unique('users', 'name')->ignore($user->id)],
            'date_of_birth' => ['nullable', 'date'],
            'address' => ['nullable', 'string', 'max:500'],
            'profile_image' => ['nullable', 'image', 'max:2048'],
        ]);

        $profileImage = $user->profile_image;
        if ($request->hasFile('profile_image')) {
            $file = $request->file('profile_image');
            $directory = public_path('profile_images');
            if (! File::exists($directory)) {
                File::makeDirectory($directory, 0755, true);
            }

            $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
            $extension = $file->getClientOriginalExtension();
            $filename = ($filename ?: 'profile').'-'.Str::random(8).'.'.$extension;

            $file->move($directory, $filename);

            if ($profileImage && $profileImage !== 'default.jpg') {
                File::delete(public_path($profileImage));
            }

            $profileImage = 'profile_images/'.$filename;
        }

        $user->forceFill([
            'name' => $data['name'],
            'date_of_birth' => $data['date_of_birth'] ?? null,
            'address' => $data['address'] ?? null,
            'profile_image' => $profileImage,
        ])->save();

        return redirect()->route('account.index')->with('status', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validateWithBag('password', [
            'current_password' => ['required'],
            'password' => ['required', 'confirmed', Password::min(8)->letters()->numbers()],
        ]);

        if (! Hash::check($data['current_password'], $user->password)) {
            return back()->withErrors([
                'current_password' => 'The current password is incorrect.',
            ], 'password');
        }

        $user->forceFill([
            'password' => Hash::make($data['password']),
        ])->save();

        return redirect()->route('account.index')->with('status', 'Password updated successfully.');
    }

    public function cancelOrder(Request $request, int $order): JsonResponse
    {
        $user = $request->user();

        $orderRecord = DB::table('orders')
            ->where('order_id', $order)
            ->where('customer_id', $user->id)
            ->first();

        if (! $orderRecord) {
            return response()->json([
                'success' => false,
                'error' => 'Order not found.',
            ], 404);
        }

        if (in_array($orderRecord->status, ['delivered', 'shipped', 'cancelled'], true)) {
            return response()->json([
                'success' => false,
                'error' => 'This order can no longer be cancelled.',
            ], 422);
        }

        DB::table('orders')
            ->where('order_id', $orderRecord->order_id)
            ->update([
                'status' => 'cancelled',
                'updated_at' => now(),
            ]);

        return response()->json(['success' => true]);
    }

    /**
     * @param  array<int, object>  $orders
     * @return array<int, array<string, mixed>>
     */
    private function buildOrderItemsMap(array $orders): array
    {
        $allowedTables = collect(Config::get('categories', []))->values()->all();

        $idsByTable = [];
        $orderItems = [];

        foreach ($orders as $order) {
            $items = $this->parseOrderItems($order->items, $allowedTables);
            $orderItems[$order->order_id] = [
                'order' => $order,
                'items' => $items,
            ];

            foreach ($items as $item) {
                $idsByTable[$item['table']][] = $item['id'];
            }
        }

        $detailsByTable = [];
        foreach ($idsByTable as $table => $ids) {
            $uniqueIds = array_values(array_unique($ids));
            if ($uniqueIds === []) {
                continue;
            }

            $detailsByTable[$table] = DB::table($table)
                ->whereIn('id', $uniqueIds)
                ->get(['id', 'name', 'price'])
                ->keyBy('id');
        }

        $result = [];
        foreach ($orderItems as $orderId => $data) {
            $order = $data['order'];
            $items = [];

            foreach ($data['items'] as $item) {
                $tableDetails = $detailsByTable[$item['table']] ?? collect();
                $detail = $tableDetails->get($item['id']);
                if (! $detail) {
                    continue;
                }

                $items[] = [
                    'table' => $item['table'],
                    'id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'name' => $detail->name,
                    'price' => (int) ($detail->price ?? 0),
                ];
            }

            $result[] = [
                'order' => $order,
                'items' => $items,
            ];
        }

        return $result;
    }

    /**
     * @param  list<string>  $allowedTables
     * @return array<int, array{table:string,id:int,quantity:int}>
     */
    private function parseOrderItems(?string $raw, array $allowedTables): array
    {
        $raw = trim((string) $raw);
        if ($raw === '') {
            return [];
        }

        $items = [];
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
}
