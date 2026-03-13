@extends('layouts.app')

@section('content')
<div class="container my-4">
    <h2 class="text-center my-3">Search Results for: {{ $query !== '' ? $query : 'All Components' }}</h2>

    @if($query === '')
        <div class="alert alert-info" style="margin: 4rem 0;">
            Please enter a search query to see matching components.
        </div>
    @elseif($items->isEmpty())
        <div class="alert alert-warning" style="margin: 4rem 0;">
            No items found for this search.
        </div>
    @else
        <div class="row mb-3">
            <div class="col-12 col-md-3 mb-3">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle w-100" type="button" id="sortDropdown" data-toggle="dropdown" aria-expanded="false">
                        Sort By {{ $sort === 'highest' ? 'Highest Price' : ($sort === 'cheapest' ? 'Cheapest Price' : 'Brand') }}
                    </button>
                    <div class="dropdown-menu" aria-labelledby="sortDropdown">
                        <a class="dropdown-item" href="{{ request()->fullUrlWithQuery(['sort' => 'highest']) }}">Highest Price</a>
                        <a class="dropdown-item" href="{{ request()->fullUrlWithQuery(['sort' => 'cheapest']) }}">Cheapest Price</a>
                        <a class="dropdown-item" href="{{ request()->fullUrlWithQuery(['sort' => null]) }}">Brand</a>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                @foreach($items as $index => $item)
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 slide-up" style="animation-delay: {{ $index * 0.1 }}s;">
                        <div class="card h-100 text-dark p-0" style="border: none; border-radius: 10px; background-color: var(--bg-elevated);">
                            <a href="{{ route('items.show', [$item->item_table, $item->id]) }}" class="nav-link">
                                <img src="{{ $item->image }}" alt="{{ $item->name }}" class="card-img-top" style="height: 200px; object-fit: cover; background-color: white;">
                            </a>
                            <div class="card-body">
                                <p class="card-text mb-2" style="font-family: 'Roboto', sans-serif; font-weight: 100; font-size: 1.1rem;">
                                    <strong>{{ number_format($item->price, 0, ',', '.') }}₫</strong>
                                </p>
                                <h6 class="card-title h6 mb-0">
                                    {{ $item->name }}
                                </h6>
                            </div>
                            <div class="card-footer d-flex" style="padding: 0; height: 50px; border: none;">
                                <form method="post" action="{{ route('cart.add') }}" style="flex: 7; height: 100%; margin: 0;">
                                    @csrf
                                    <input type="hidden" name="table" value="{{ $item->item_table }}">
                                    <input type="hidden" name="id" value="{{ $item->id }}">
                                    <button type="submit" class="btn btn-primary btn-sm w-100 h-100" style="border-radius: 0;" {{ auth()->guest() ? 'onclick=\'return confirm("Please sign in to add items to the cart.")\'' : '' }}>Add to Cart</button>
                                </form>
                                <a href="{{ route('items.show', [$item->item_table, $item->id]) }}" class="btn btn-secondary w-100 h-100" style="flex: 3; border-radius: 0;">View</a>
                            </div>
                        </div>
                    </div>
                @endforeach
            </div>
        </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    .slide-up {
        opacity: 0;
        transform: translateY(30px);
        animation: slideUp 0.5s ease-out forwards;
    }

    @keyframes slideUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
@endpush
