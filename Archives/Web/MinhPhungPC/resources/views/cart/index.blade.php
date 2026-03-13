@extends('layouts.app')

@section('content')
<div class="container my-5">
    <h2 class="mb-4">Your Cart</h2>

    @if(session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif
    @if(session('error'))
        <div class="alert alert-danger">{{ session('error') }}</div>
    @endif
    @if($errors->any())
        <div class="alert alert-danger">
            <ul class="mb-0">
                @foreach($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    @if(empty($items))
        <div class="alert alert-info">Your cart is empty.</div>
    @else
        <div class="cart-items mb-4">
            @foreach($items as $item)
                <div class="cart-item shadow-sm mb-3 p-3 rounded d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center">
                        <img src="{{ $item['image'] }}" alt="{{ $item['name'] }}" class="rounded mr-3" style="width: 80px; height: 80px; object-fit: cover; background-color: #fff;">
                        <div>
                            <h5 class="mb-1">{{ $item['name'] }}</h5>
                            <p class="mb-0 text-muted">{{ $item['brand'] }}</p>
                            <strong class="text-success">{{ number_format($item['price'], 0, ',', '.') }}₫</strong>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <form class="d-flex align-items-center mr-3" data-quantity-form>
                            @csrf
                            <input type="hidden" name="table" value="{{ $item['table'] }}">
                            <input type="hidden" name="id" value="{{ $item['id'] }}">
                            <input type="number" name="quantity" value="{{ $item['quantity'] }}" min="1" class="form-control form-control-sm" style="width:80px;">
                        </form>
                        <form method="post" action="{{ route('cart.remove') }}" class="mb-0">
                            @csrf
                            <input type="hidden" name="table" value="{{ $item['table'] }}">
                            <input type="hidden" name="id" value="{{ $item['id'] }}">
                            <button type="submit" class="btn btn-outline-danger btn-sm">Remove</button>
                        </form>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="d-flex justify-content-between align-items-center mb-4">
            <h4>Total: <span id="cartTotal" class="text-success">{{ number_format($total, 0, ',', '.') }}₫</span></h4>
            <form method="post" action="{{ route('cart.clear') }}">
                @csrf
                <button type="submit" class="btn btn-danger">Clear Cart</button>
            </form>
        </div>

        <div class="card shadow-sm">
            <div class="card-body">
                <h4 class="card-title">Checkout</h4>
                <form method="post" action="{{ route('cart.checkout') }}">
                    @csrf
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="name">Name</label>
                            <input type="text" class="form-control" id="name" name="name" value="{{ old('name', auth()->user()->name) }}" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="email">Email</label>
                            <input type="email" class="form-control" id="email" name="email" value="{{ old('email', auth()->user()->email) }}" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="phone">Phone</label>
                            <input type="text" class="form-control" id="phone" name="phone" value="{{ old('phone') }}" required>
                        </div>
                        <div class="form-group col-md-6">
                            <label for="payment_method">Payment Method</label>
                            <select class="form-control" id="payment_method" name="payment_method" required>
                                <option value="COD" {{ old('payment_method') === 'COD' ? 'selected' : '' }}>Cash on Delivery</option>
                                <option value="Bank" {{ old('payment_method') === 'Bank' ? 'selected' : '' }}>Bank Transfer</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="address">Shipping Address</label>
                        <textarea class="form-control" id="address" name="address" rows="3" required>{{ old('address', auth()->user()->address) }}</textarea>
                    </div>
                    <button type="submit" class="btn btn-success">Place Order</button>
                </form>
            </div>
        </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    .cart-item { background-color: var(--bg-secondary, #fff); }
</style>
@endpush

@push('scripts')
<script>
    document.querySelectorAll('[data-quantity-form]').forEach(form => {
        const input = form.querySelector('input[name="quantity"]');
        input.addEventListener('change', () => updateQuantity(form));
    });

    function updateQuantity(form) {
        const data = {
            table: form.querySelector('input[name="table"]').value,
            id: Number(form.querySelector('input[name="id"]').value),
            quantity: Number(form.querySelector('input[name="quantity"]').value),
        };

        fetch('{{ route('cart.update') }}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}',
            },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    document.getElementById('cartTotal').textContent = data.newTotal;
                }
            });
    }
</script>
@endpush
