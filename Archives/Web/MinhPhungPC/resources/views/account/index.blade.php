@extends('layouts.app')

@section('content')
<div class="container my-5">
    <h2 class="mb-4">Your Account</h2>

    @if(session('status'))
        <div class="alert alert-success">{{ session('status') }}</div>
    @endif

    <div class="text-center mb-4">
        <img src="{{ asset($user->profile_image ?? 'default.jpg') }}" alt="Profile image" class="rounded-circle account-avatar">
    </div>

    <ul class="nav nav-tabs" id="accountTabs" role="tablist">
        <li class="nav-item" role="presentation">
            <a class="nav-link active" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="true">Profile</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" id="orders-tab" data-toggle="tab" href="#orders" role="tab" aria-controls="orders" aria-selected="false">Order History</a>
        </li>
    </ul>

    <div class="tab-content" id="accountTabsContent">
        <div class="tab-pane fade show active p-4 border-left border-right border-bottom" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            @if($errors->profile->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->profile->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('account.profile') }}" method="POST" enctype="multipart/form-data" class="mb-5">
                @csrf
                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="name">Username</label>
                        <input type="text" id="name" name="name" class="form-control" value="{{ old('name', $user->name) }}" required>
                    </div>
                    <div class="form-group col-md-6">
                        <label for="email">Email</label>
                        <input type="email" id="email" class="form-control" value="{{ $user->email }}" readonly>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group col-md-6">
                        <label for="date_of_birth">Date of Birth</label>
                        <input type="date" id="date_of_birth" name="date_of_birth" class="form-control" value="{{ old('date_of_birth', optional($user->date_of_birth)->format('Y-m-d')) }}">
                    </div>
                    <div class="form-group col-md-6">
                        <label for="address">Address</label>
                        <input type="text" id="address" name="address" class="form-control" value="{{ old('address', $user->address) }}">
                    </div>
                </div>

                <div class="form-group">
                    <label for="profile_image">Profile Image (JPG or PNG, up to 2MB)</label>
                    <input type="file" id="profile_image" name="profile_image" class="form-control-file" accept="image/png,image/jpeg">
                </div>

                <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>

            <h5>Change Password</h5>

            @if($errors->password->any())
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        @foreach($errors->password->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form action="{{ route('account.password') }}" method="POST">
                @csrf
                <div class="form-group">
                    <label for="current_password">Current Password</label>
                    <input type="password" id="current_password" name="current_password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password">New Password</label>
                    <input type="password" id="password" name="password" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="password_confirmation">Confirm New Password</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-warning">Change Password</button>
            </form>
        </div>

        <div class="tab-pane fade p-4 border-left border-right border-bottom" id="orders" role="tabpanel" aria-labelledby="orders-tab">
            @if(empty($orders))
                <div class="alert alert-info mb-0">You have no order history.</div>
            @else
                @foreach($orders as $index => $orderData)
                    @php
                        $order = $orderData['order'];
                        $statusClass = match ($order->status) {
                            'cancelled' => 'text-danger',
                            'delivered' => 'text-success',
                            default => ''
                        };
                        $canCancel = ! in_array($order->status, ['delivered', 'shipped', 'cancelled'], true);
                    @endphp
                    <div class="card mb-4" id="order-{{ $order->order_id }}">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="mb-0">Order #{{ count($orders) - $index }}</h5>
                                <span class="font-weight-bold {{ $statusClass }}" id="status-{{ $order->order_id }}">{{ ucfirst($order->status ?? 'pending') }}</span>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <p class="mb-1"><strong>Date:</strong> {{ $order->order_date }}</p>
                                    <p class="mb-1"><strong>Total:</strong> {{ number_format((int) $order->total_amount, 0, ',', '.') }}₫</p>
                                    <p class="mb-1"><strong>Payment Method:</strong> {{ $order->payment_method }}</p>
                                </div>
                                <div class="col-md-6">
                                    <p class="mb-1"><strong>Address:</strong> {{ $order->address }}</p>
                                    <p class="mb-1"><strong>Phone:</strong> {{ $order->phone }}</p>
                                    <p class="mb-1"><strong>Payment Status:</strong> {{ ucfirst($order->payment_status ?? 'pending') }}</p>
                                </div>
                            </div>
                            <p class="mt-3 mb-2"><strong>Items:</strong></p>
                            <ul class="list-unstyled mb-3">
                                @foreach($orderData['items'] as $item)
                                    <li>{{ $item['name'] }} ({{ number_format($item['price'], 0, ',', '.') }}₫) x{{ $item['quantity'] }}</li>
                                @endforeach
                            </ul>
                            @if($canCancel)
                                <button class="btn btn-outline-danger btn-sm" data-order-id="{{ $order->order_id }}" data-cancel-url="{{ route('orders.cancel', $order->order_id) }}">Cancel Order</button>
                            @endif
                        </div>
                    </div>
                @endforeach
            @endif
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .account-avatar {
        width: 150px;
        height: 150px;
        object-fit: cover;
        border: 4px solid var(--bg-secondary, #f8f9fa);
    }
</style>
@endpush

@push('scripts')
<script>
    document.querySelectorAll('[data-order-id]').forEach(button => {
        button.addEventListener('click', () => {
            if (!confirm('Are you sure you want to cancel this order?')) {
                return;
            }

            const orderId = button.getAttribute('data-order-id');
            const url = button.getAttribute('data-cancel-url');

            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        const statusEl = document.getElementById(`status-${orderId}`);
                        if (statusEl) {
                            statusEl.textContent = 'Cancelled';
                            statusEl.classList.remove('text-success');
                            statusEl.classList.add('text-danger');
                        }
                        button.remove();
                    } else if (data.error) {
                        alert(data.error);
                    }
                })
                .catch(() => alert('Unable to cancel the order. Please try again later.'));
        });
    });
</script>
@endpush
