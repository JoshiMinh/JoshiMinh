<?php

namespace App\Http\Controllers;

use App\Services\BuildSetManager;
use App\Services\CartManager;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class BuildSetController extends Controller
{
    public function __construct(private readonly BuildSetManager $buildSetManager, private readonly CartManager $cartManager)
    {
    }

    public function replace(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $this->buildSetManager->replaceWithCookie($user, $request);
        }

        return redirect()->route('builder');
    }

    public function discard()
    {
        $this->buildSetManager->discardCookie();

        return redirect()->route('builder');
    }

    public function addToCart(): JsonResponse
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json([
                'success' => false,
                'message' => 'You must be logged in!',
            ], 200);
        }

        $rawBuildSet = $this->buildSetManager->parseBuildSet($user->buildset ?? '');
        if ($rawBuildSet === []) {
            return response()->json([
                'success' => false,
                'message' => "There's no components in the build!",
            ], 200);
        }

        $components = $this->buildSetManager->hydrateComponents($user->buildset ?? '');
        if (count($components) !== count($rawBuildSet)) {
            return response()->json([
                'success' => false,
                'message' => 'One or more selected components are no longer available.',
            ], 200);
        }

        foreach ($components as $component) {
            $this->guardComponentTable($component['table']);
            $this->cartManager->addItem($user, $component['table'], $component['id']);
        }

        $this->buildSetManager->clear($user);

        return response()->json([
            'success' => true,
            'message' => 'Added all components to the cart!',
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_name' => ['required', 'string'],
            'component_id' => ['required', 'integer'],
        ]);

        $table = $validated['table_name'];
        $componentId = $validated['component_id'];

        $this->guardComponentTable($table);

        $component = DB::table($table)->where('id', $componentId)->first();
        if (! $component) {
            return response()->json([
                'status' => 'error',
                'message' => 'Component not found.',
            ], 404);
        }

        $user = Auth::user();
        $state = $this->buildSetManager->updateComponent($table, $componentId, $user, $request);

        return response()->json([
            'status' => 'success',
            'totalAmount' => $state['total'],
            'component' => [
                'id' => $componentId,
                'name' => $component->name,
                'price' => (int) ($component->price ?? 0),
                'image' => $component->image,
                'brand' => $component->brand ?? null,
            ],
        ]);
    }

    public function remove(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'table_name' => ['required', 'string'],
        ]);

        $table = $validated['table_name'];
        $this->guardComponentTable($table);

        $user = Auth::user();
        $state = $this->buildSetManager->removeComponent($table, $user, $request);

        return response()->json([
            'status' => 'success',
            'totalAmount' => $state['total'],
        ]);
    }

    public function clear(): JsonResponse
    {
        $user = Auth::user();
        $this->buildSetManager->clear($user);

        return response()->json(['status' => 'success']);
    }

    public function available(Request $request): JsonResponse
    {
        $table = $request->string('table');
        if ($table->isEmpty()) {
            return response()->json(['items' => [], 'count' => 0]);
        }

        $this->guardComponentTable($table);
        $buildset = $this->buildSetManager->parseBuildSet(Auth::user()?->buildset ?? $request->cookie('buildset'));

        $query = DB::table($table->value())
            ->select('id', 'name', 'brand', 'image', 'price');

        if ($table->value() === 'processor' && isset($buildset['motherboard'])) {
            $motherboardId = $buildset['motherboard'];
            $query->where('socket_type', function ($sub) use ($motherboardId) {
                $sub->select('socket_type')->from('motherboard')->where('id', $motherboardId);
            });
        }

        if ($table->value() === 'memory' && isset($buildset['motherboard'])) {
            $motherboardId = $buildset['motherboard'];
            $query->where('ddr', function ($sub) use ($motherboardId) {
                $sub->select('ddr')->from('motherboard')->where('id', $motherboardId);
            });
        }

        if ($table->value() === 'motherboard') {
            if (isset($buildset['memory'])) {
                $memoryId = $buildset['memory'];
                $query->where('ddr', function ($sub) use ($memoryId) {
                    $sub->select('ddr')->from('memory')->where('id', $memoryId);
                });
            }

            if (isset($buildset['processor'])) {
                $processorId = $buildset['processor'];
                $query->where('socket_type', function ($sub) use ($processorId) {
                    $sub->select('socket_type')->from('processor')->where('id', $processorId);
                });
            }
        }

        $items = $query->orderBy('brand')->get()->map(function ($item) use ($table) {
            return [
                'id' => $item->id,
                'name' => $item->name,
                'brand' => $item->brand,
                'image' => $item->image,
                'price' => (int) $item->price,
                'item_table' => $table->value(),
            ];
        })->all();

        return response()->json([
            'items' => $items,
            'count' => count($items),
        ]);
    }

    private function guardComponentTable(string $table): void
    {
        $allowed = collect(Config::get('categories', []))->values();
        if (! $allowed->contains($table)) {
            abort(404);
        }
    }
}
