@extends('layouts.app')

@section('content')
<div class="container my-5">
    <div class="row">
        <div class="col-md-6 mb-4">
            <img src="{{ $item->image }}" class="img-fluid rounded shadow-sm" alt="{{ $item->name }}">
        </div>
        <div class="col-md-6">
            <div class="card shadow-sm mb-3">
                <div class="card-body">
                    <h2 class="card-title">{{ $item->name }}</h2>
                    <div class="ratings mb-3" id="rating-stars">
                        @for($i = 1; $i <= 5; $i++)
                            <span class="star {{ $userRating !== null && $i <= $userRating ? 'fas fa-star' : ($userRating === null && $i <= floor($averageRating) ? 'fas fa-star' : 'far fa-star') }}" data-value="{{ $i }}"></span>
                        @endfor
                        <span class="ml-2">({{ $ratingCount }} ratings)</span>
                    </div>
                    <p class="h4 text-success">{{ number_format($item->price, 0, ',', '.') }}₫</p>
                    <p><strong>Brand:</strong> {{ $item->brand ?? 'N/A' }}</p>
                    <form method="post" action="{{ route('cart.add') }}">
                        @csrf
                        <input type="hidden" name="table" value="{{ $table }}">
                        <input type="hidden" name="id" value="{{ $item->id }}">
                        <button type="submit" class="btn btn-primary btn-block" {{ auth()->guest() ? 'onclick=\'return confirm("Please sign in to add items to the cart.")\'' : '' }}>Add to Cart</button>
                    </form>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-body">
                    <h4>Description</h4>
                    <ul class="list-unstyled">
                        @foreach((array) $item as $key => $value)
                            @if(!in_array($key, ['id', 'name', 'price', 'image', 'brand', 'ratings', 'created_at', 'updated_at']))
                                <li><strong>{{ ucwords(str_replace(['_', 'tdp'], [' ', 'TDP'], $key)) }}:</strong> {{ $value }}</li>
                            @endif
                        @endforeach
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-5">
        <h4>Comments</h4>
        @auth
            <form method="post" action="{{ route('items.store', [$table, $item->id]) }}" class="mb-4">
                @csrf
                <div class="form-group">
                    <label for="comment">Add a comment:</label>
                    <textarea name="comment" id="comment" rows="3" class="form-control" required></textarea>
                </div>
                <div class="form-group">
                    <label>Rate this product:</label>
                    <div class="d-flex align-items-center">
                        @for($i = 1; $i <= 5; $i++)
                            <label class="mr-2">
                                <input type="radio" name="rating" value="{{ $i }}" {{ $userRating === $i ? 'checked' : '' }}> {{ $i }}
                            </label>
                        @endfor
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Submit</button>
            </form>
        @else
            <p><a href="{{ route('login') }}">Log in</a> to post a comment.</p>
        @endauth

        @if($comments->isEmpty())
            <p>No comments yet. Be the first to comment!</p>
        @else
            <ul class="list-unstyled">
                @foreach($comments as $comment)
                    <li class="media my-3 p-3 rounded shadow-sm" style="background-color: var(--bg-elevated, #f8f9fa);">
                        <img src="{{ asset($comment->profile_image ?? 'default.jpg') }}" alt="{{ $comment->name }}" class="mr-3 rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="media-body">
                            <h5 class="mt-0 mb-1">{{ $comment->name }} <small class="text-muted">{{ \Carbon\Carbon::parse($comment->time)->format('F j, Y, g:i a') }}</small></h5>
                            <p class="mb-0">{{ $comment->content }}</p>
                        </div>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
</div>
@endsection

@push('styles')
<style>
    .ratings .fa-star { font-size: 1.5rem; color: #ccc; cursor: pointer; }
    .ratings .fas.fa-star { color: #ffcc00; }
</style>
@endpush

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', () => {
        const stars = document.querySelectorAll('#rating-stars .star');
        const feedbackUrl = @json(route('items.store', [$table, $item->id]));
        const form = document.querySelector(`form[action="${feedbackUrl}"]`);
        if (!form) {
            return;
        }

        stars.forEach(star => {
            star.addEventListener('mouseover', () => highlightStars(Number(star.dataset.value)));
            star.addEventListener('mouseout', resetStars);
            star.addEventListener('click', () => {
                const value = Number(star.dataset.value);
                let radio = form.querySelector(`input[name="rating"][value="${value}"]`);
                if (radio) {
                    radio.checked = true;
                }
                highlightStars(value);
            });
        });

        function highlightStars(count) {
            stars.forEach(star => {
                star.classList.toggle('fas', Number(star.dataset.value) <= count);
                star.classList.toggle('far', Number(star.dataset.value) > count);
            });
        }

        function resetStars() {
            const checked = form.querySelector('input[name="rating"]:checked');
            const current = checked ? Number(checked.value) : {{ $userRating ?? 'null' }};
            stars.forEach(star => {
                star.classList.toggle('fas', current && Number(star.dataset.value) <= current);
                star.classList.toggle('far', !current || Number(star.dataset.value) > current);
            });
        }

        resetStars();
    });
</script>
@endpush
