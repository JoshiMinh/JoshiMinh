@extends('layouts.app')

@section('content')
<div class="container my-4">
    <h2 class="text-center mb-4">{{ $categoryName }}</h2>
    <div class="row">
        <div class="col-12 col-md-3 mb-4">
            <div class="card shadow-sm">
                <div class="card-body">
                    <form method="get" action="{{ route('categories.show', $table) }}">
                        <h5 class="card-title">Filter by Price (₫)</h5>
                        <div class="form-group">
                            <label for="minPrice">Min Price</label>
                            <input type="text" class="form-control" id="minPrice" name="min_price" value="{{ number_format($minPrice, 0, ',', '.') }}" oninput="formatPriceInput(this)">
                        </div>
                        <div class="form-group">
                            <label for="maxPrice">Max Price</label>
                            <input type="text" class="form-control" id="maxPrice" name="max_price" value="{{ number_format($maxPrice, 0, ',', '.') }}" oninput="formatPriceInput(this)">
                        </div>

                        <h5 class="card-title mt-4">Filter by Brand</h5>
                        <div class="brands-container">
                            @foreach($brands as $brand)
                                @php $value = is_array($brand) ? ($brand['brand'] ?? $brand) : $brand; @endphp
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" name="brands[]" value="{{ $value }}" id="brand-{{ \Illuminate\Support\Str::slug($value) }}" {{ in_array($value, $selectedBrands, true) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="brand-{{ \Illuminate\Support\Str::slug($value) }}">{{ $value }}</label>
                                </div>
                            @endforeach
                        </div>

                        <input type="hidden" name="sort" value="{{ $sort }}">
                        <button type="submit" class="btn btn-primary btn-block mt-4">Apply Filters</button>
                    </form>
                </div>
            </div>
        </div>

        <div class="col-12 col-md-9">
            <div class="d-flex justify-content-end mb-3">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="sortDropdown" data-toggle="dropdown" aria-expanded="false">
                        Sort By {{ $sort === 'highest' ? 'Highest Price' : ($sort === 'cheapest' ? 'Cheapest Price' : 'Brand') }}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="sortDropdown">
                        <a class="dropdown-item" href="{{ request()->fullUrlWithQuery(['sort' => 'highest']) }}">Highest Price</a>
                        <a class="dropdown-item" href="{{ request()->fullUrlWithQuery(['sort' => 'cheapest']) }}">Cheapest Price</a>
                        <a class="dropdown-item" href="{{ request()->fullUrlWithQuery(['sort' => null]) }}">Brand</a>
                    </div>
                </div>
            </div>

            @if($items->isEmpty())
                <div class="alert alert-warning">No items found.</div>
            @else
                <div class="row">
                    @foreach($items as $item)
                        <div class="col-12 col-sm-6 col-lg-4 mb-4">
                            <div class="card h-100 shadow-sm border-0">
                                <a href="{{ route('items.show', [$item->item_table, $item->id]) }}" class="text-decoration-none">
                                    <img src="{{ $item->image }}" alt="{{ $item->name }}" class="card-img-top" style="height: 200px; object-fit: cover; background-color: #fff;">
                                </a>
                                <div class="card-body">
                                    <p class="card-text text-success font-weight-bold">{{ number_format($item->price, 0, ',', '.') }}₫</p>
                                    <h6 class="card-title text-dark">{{ $item->name }}</h6>
                                </div>
                                <div class="card-footer d-flex p-0">
                                    <form method="post" action="{{ route('cart.add') }}" class="flex-grow-1">
                                        @csrf
                                        <input type="hidden" name="table" value="{{ $item->item_table }}">
                                        <input type="hidden" name="id" value="{{ $item->id }}">
                                        <button type="submit" class="btn btn-primary btn-sm w-100" {{ auth()->guest() ? 'onclick=\'return confirm("Please sign in to add items to the cart.")\'' : '' }}>Add to Cart</button>
                                    </form>
                                    <a href="{{ route('items.show', [$item->item_table, $item->id]) }}" class="btn btn-secondary btn-sm" style="border-radius: 0;">View</a>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>
            @endif
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script>
    function formatPriceInput(input) {
        const digits = input.value.replace(/[^\d]/g, '');
        input.value = new Intl.NumberFormat('de-DE').format(digits);
    }
</script>
@endpush
