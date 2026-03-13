@php
    $categoryMap = config('categories', []);
    $user = auth()->user();
    $cartRaw = $user?->cart;
    $cartCount = $cartRaw ? count(array_filter(preg_split('/\s+/', trim($cartRaw)))) : 0;
@endphp

<style>
    .navbar-main, .navbar-secondary, .navbar-mobile, .navbar-mobile-secondary {
        transition: background-color 0.3s, border-color 0.3s;
    }

    .navbar-main {
        background-color: var(--bg-primary);
        border-bottom: 1px solid var(--border-color);
    }

    .navbar-secondary {
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    }

    .navbar-secondary a, .navbar-mobile-secondary a {
        color: white;
        text-align: center;
        padding: 10px;
        display: block;
    }

    .navbar-secondary a:hover {
        background-color: var(--navbar-hover);
    }

    .search-input-container {
        display: flex;
        width: 100%;
        position: relative;
    }

    .search-input {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--border-color);
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-radius: 4px 0 0 4px;
    }

    .search-input:focus {
        outline: none;
        border-color: var(--primary-color);
    }

    .search-button {
        background-color: var(--primary-color);
        border: 1px solid var(--primary-color);
        border-radius: 0 4px 4px 0;
        padding: 0 12px;
        cursor: pointer;
        color: white;
    }

    .search-button:hover {
        background-color: var(--primary-hover);
    }

    .dropdown-menu.search-dropdown {
        max-height: 300px;
        overflow-y: auto;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 1050;
        display: none;
        border: 1px solid var(--border-color);
        background-color: var(--bg-elevated);
    }

    .dropdown-menu.search-dropdown.show {
        display: block;
    }

    .dropdown-menu.search-dropdown .dropdown-item {
        background-color: var(--bg-elevated);
        color: var(--text-primary);
        display: flex;
        align-items: center;
    }

    .dropdown-menu.search-dropdown .dropdown-item img {
        width: 60px;
        height: 60px;
        margin-right: 10px;
        object-fit: cover;
        background-color: #fff;
    }

    .navbar-toggler {
        border-color: transparent;
    }

    .navbar-toggler-icon {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3E%3Cpath stroke='%23888888' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
    }

    .navbar-mobile {
        background-color: var(--bg-primary);
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        z-index: 1050;
        transition: max-height 0.3s ease-in-out;
        overflow: hidden;
    }

    .navbar-mobile-secondary {
        background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
    }

    .navbar-mobile .categories {
        white-space: nowrap;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>

<nav>
    <div class="navbar navbar-expand-lg navbar-main d-none d-lg-flex">
        <a href="{{ route('builder') }}" class="navbar-brand" style="width: 10%;" title="Home">
            <img src="{{ asset('logo.png') }}" alt="MinhPhungPC Logo" style="width: 100%;">
        </a>
        <div class="mx-auto" style="width: 50%;">
            <div class="search-input-container">
                <input type="text" class="search-input" id="searchQuery" placeholder="Find component" autocomplete="off">
                <button class="search-button" id="searchBtn">
                    <i class="fas fa-search"></i>
                </button>
                <div id="desktopSearchDropdown" class="dropdown-menu search-dropdown"></div>
            </div>
        </div>
        <div class="d-flex align-items-center ml-auto">
            <button id="switchBtn" class="btn btn-link p-0" aria-label="Toggle dark mode">
                <i class="bi bi-moon icon"></i>
            </button>
            @auth
                <div class="mx-2">
                    <a href="{{ route('account.index') }}">
                        <img src="{{ asset($user->profile_image ?? 'default.jpg') }}" class="rounded-circle" style="width: 35px; height: 35px; object-fit: cover;" title="Profile">
                    </a>
                </div>
                <a href="{{ route('cart.index') }}" class="btn btn-secondary" title="View Cart">
                    <i class="fas fa-shopping-cart"></i> {{ $cartCount }}
                </a>
            @else
                <div class="mx-2">
                    <a href="{{ route('login') }}" class="btn btn-primary" title="Sign In">
                        <i class="fas fa-user"></i>
                    </a>
                </div>
                <a href="{{ route('cart.index') }}" class="btn btn-secondary" title="View Cart">
                    <i class="fas fa-shopping-cart"></i>
                </a>
            @endauth
        </div>
    </div>

    <div class="navbar navbar-secondary navbar-gradient d-none d-lg-flex">
        <div class="navbar-collapse">
            <ul class="navbar-nav flex-row w-100">
                @foreach ($categoryMap as $category => $tableName)
                    <li class="nav-item flex-fill">
                        <a href="{{ route('categories.show', $tableName) }}" class="nav-link" title="Explore {{ $category }}">{{ $category }}</a>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
</nav>

<nav class="navbar-mobile-secondary d-lg-none">
    <div>
        <div class="d-flex align-items-center p-2 justify-content-between">
            <a href="{{ route('builder') }}" class="navbar-brand" style="width: 40%;" title="Home">
                <img src="{{ asset('logo_light.png') }}" alt="MinhPhungPC Logo" style="width: 100%;">
            </a>
            <div class="d-flex align-items-center">
                <button id="switchBtnMobile" class="btn btn-link p-0" aria-label="Toggle dark mode">
                    <i class="bi bi-moon icon"></i>
                </button>
                @auth
                    <div class="mx-2">
                        <a href="{{ route('account.index') }}">
                            <img src="{{ asset($user->profile_image ?? 'default.jpg') }}" class="rounded-circle" style="width: 35px; height: 35px; object-fit: cover;" title="Profile">
                        </a>
                    </div>
                    <a href="{{ route('cart.index') }}" class="btn btn-secondary" title="View Cart">
                        <i class="fas fa-shopping-cart"></i> {{ $cartCount }}
                    </a>
                @else
                    <div class="mx-2">
                        <a href="{{ route('login') }}" class="btn btn-primary" title="Sign In">
                            <i class="fas fa-user"></i>
                        </a>
                    </div>
                    <a href="{{ route('cart.index') }}" class="btn btn-secondary" title="View Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </a>
                @endauth
            </div>
        </div>
        <div class="search-input-container p-2">
            <input type="text" class="form-control search-input" id="mobileSearchQuery" placeholder="Find component" autocomplete="off">
            <button class="search-button" id="searchBtnMobile">
                <i class="fas fa-search"></i>
            </button>
            <div id="mobileSearchDropdown" class="dropdown-menu search-dropdown"></div>
        </div>
        <div class="categories px-2 pb-2">
            <ul class="navbar-nav flex-row" style="color: grey;">
                @foreach ($categoryMap as $category => $tableName)
                    <li class="px-1">
                        <a href="{{ route('categories.show', $tableName) }}">{{ $category }}</a>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
</nav>

@push('scripts')
<script>
    const searchSuggestRoute = @json(route('search.suggest'));
    const searchResultsRoute = @json(route('search'));
    const itemRouteBase = @json(url('items'));

    function performSearch(inputId) {
        const input = document.getElementById(inputId);
        const query = input?.value?.trim();
        if (!query) {
            return;
        }

        window.location.href = `${searchResultsRoute}?search=${encodeURIComponent(query)}`;
    }

    function createResultTemplate(component) {
        const brand = component.brand ? `<span>${component.brand}</span>` : '';
        return `
            <div class="dropdown-item" data-table="${component.item_table}" data-id="${component.id}">
                <img src="${component.image ?? 'https://via.placeholder.com/60x60?text=PC'}" alt="${component.name}">
                <div class="d-flex flex-column">
                    <strong>${component.name}</strong>
                    <span>${new Intl.NumberFormat('vi-VN').format(component.price ?? 0)}₫</span>
                    ${brand}
                </div>
            </div>
        `;
    }

    function attachResultHandlers(dropdown) {
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', () => {
                const table = item.dataset.table;
                const id = item.dataset.id;
                if (table && id) {
                    window.location.href = `${itemRouteBase}/${table}/${id}`;
                }
            });
        });
    }

    function searchComponents(inputId) {
        const input = document.getElementById(inputId);
        if (!input) {
            return;
        }

        const query = input.value.trim();
        const dropdownId = inputId === 'searchQuery' ? 'desktopSearchDropdown' : 'mobileSearchDropdown';
        const dropdown = document.getElementById(dropdownId);

        if (!dropdown) {
            return;
        }

        if (!query) {
            dropdown.classList.remove('show');
            dropdown.innerHTML = '';
            return;
        }

        fetch(`${searchSuggestRoute}?search=${encodeURIComponent(query)}`, {
            headers: {
                'Accept': 'application/json',
            }
        })
            .then(response => response.json())
            .then(results => {
                if (!Array.isArray(results) || results.length === 0) {
                    dropdown.innerHTML = "<button class='dropdown-item' disabled>No results found</button>";
                } else {
                    dropdown.innerHTML = results.slice(0, 10).map(createResultTemplate).join('');
                    attachResultHandlers(dropdown);
                }
                dropdown.classList.add('show');
            })
            .catch(() => {
                dropdown.innerHTML = "<button class='dropdown-item' disabled>Error loading results</button>";
                dropdown.classList.add('show');
            });
    }

    let debounceTimer;
    ['searchQuery', 'mobileSearchQuery'].forEach((id) => {
        const input = document.getElementById(id);
        input?.addEventListener('keyup', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => searchComponents(id), 300);
        });
        input?.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                performSearch(id);
            }
        });
    });

    document.getElementById('searchBtn')?.addEventListener('click', () => performSearch('searchQuery'));
    document.getElementById('searchBtnMobile')?.addEventListener('click', () => performSearch('mobileSearchQuery'));

    document.addEventListener('click', (event) => {
        ['desktopSearchDropdown', 'mobileSearchDropdown'].forEach(id => {
            const dropdown = document.getElementById(id);
            const input = id === 'desktopSearchDropdown' ? document.getElementById('searchQuery') : document.getElementById('mobileSearchQuery');
            if (!dropdown || !input) {
                return;
            }

            if (!dropdown.contains(event.target) && !input.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
</script>
@endpush
