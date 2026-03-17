<?php

namespace App\Http\Controllers;

use App\Services\CartManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class CartController extends Controller
{
    public function __construct(private readonly CartManager $cartManager)
    {
    }

    public function add(Request $request): RedirectResponse
    {
        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        $data = $request->validate([
            'table' => ['required', 'string'],
            'id' => ['required', 'integer'],
        ]);

        $this->guardComponentTable($data['table']);

        if (! DB::table($data['table'])->where('id', $data['id'])->exists()) {
            abort(404);
        }

        $this->cartManager->addItem($user, $data['table'], $data['id']);

        return back();
    }

    public function index(): View|RedirectResponse
    {
        $user = Auth::user();
        if (! $user) {
            return redirect()->route('login');
        }

        $items = $this->cartManager->parse($user->cart);
        $expanded = $this->cartManager->expandItems($items);
        $total = $this->cartManager->calculateTotal($items);

        return view('cart.index', [
            'items' => $expanded,
            'total' => $total,
        ]);
    }

    public function updateQuantity(Request $request): JsonResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $data = $request->validate([
            'table' => ['required', 'string'],
            'id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $this->guardComponentTable($data['table']);

        $items = $this->cartManager->parse($user->cart);
        $found = false;

        foreach ($items as &$item) {
            if ($item['table'] === $data['table'] && $item['id'] === $data['id']) {
                $item['quantity'] = $data['quantity'];
                $found = true;
            }
        }
        unset($item);

        if (! $found) {
            return response()->json([
                'status' => 'error',
                'message' => 'Item not found in cart.',
            ], 404);
        }

        $this->cartManager->setCart($user, $items);

        return response()->json([
            'status' => 'success',
            'newTotal' => number_format($this->cartManager->calculateTotal($items), 0, ',', '.').'₫',
        ]);
    }

    public function remove(Request $request): RedirectResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $data = $request->validate([
            'table' => ['required', 'string'],
            'id' => ['required', 'integer'],
        ]);

        $this->guardComponentTable($data['table']);

        $items = collect($this->cartManager->parse($user->cart))
            ->reject(fn ($item) => $item['table'] === $data['table'] && $item['id'] === $data['id'])
            ->values()
            ->all();

        $this->cartManager->setCart($user, $items);

        return back();
    }

    public function clear(): RedirectResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $this->cartManager->setCart($user, []);

        return back();
    }

    public function checkout(Request $request): RedirectResponse
    {
        $user = Auth::user();
        abort_unless($user, 403);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string'],
            'payment_method' => ['required', 'in:Bank,COD'],
        ]);

        $items = $this->cartManager->parse($user->cart);
        if ($items === []) {
            return back()->with('error', 'Your cart is empty.');
        }

        $total = $this->cartManager->calculateTotal($items);

        DB::table('orders')->insert([
            'customer_id' => $user->id,
            'items' => $this->cartManager->stringify($items),
            'order_date' => now(),
            'status' => 'pending',
            'total_amount' => $total,
            'address' => $data['address'],
            'phone' => $data['phone'],
            'payment_method' => $data['payment_method'],
            'payment_status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->cartManager->setCart($user, []);

        return redirect()->route('cart.index')->with('status', 'Your order has been successfully placed.');
    }

    private function guardComponentTable(string $table): void
    {
        $allowed = collect(Config::get('categories', []))->values();
        if (! $allowed->contains($table)) {
            abort(404);
        }
    }
}
