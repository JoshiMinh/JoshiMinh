<?php include 'scripts/categoryMap.php'; ?>

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
    padding: 0px 12px;
    cursor: pointer;
    color: white;
}

.search-button:hover {
    background-color: var(--primary-hover);
}

.dropdown-menu {
    max-height: 300px;
    overflow-y: auto;
    position: absolute;
    z-index: 1000;
}

#desktopSearchDropdown, #mobileSearchDropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 1000;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid var(--border-color);
    transition: background-color 0.3s, color 0.3s;
}

#desktopSearchDropdown .dropdown-item, #mobileSearchDropdown .dropdown-item {
    background-color: var(--bg-elevated);
    border-color: var(--border-color);
    color: var(--text-primary);
    cursor: pointer;
}

#desktopSearchDropdown .dropdown-item:hover, #mobileSearchDropdown .dropdown-item:hover {
    opacity: 0.6;
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

.navbar-mobile.open {
    max-height: 500px;
    border-bottom: 1px solid var(--border-color);
}

.navbar-mobile.closed {
    max-height: 0;
    border-bottom: none;
}

.navbar-mobile-secondary {
    background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
}

.navbar-mobile.open {
    margin-top: 60px;
}

.navbar-mobile.closed {
    margin-top: 0;
}

.btn-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: transparent;
    border: none;
    font-size: 1.5rem;
    color: white;
    cursor: pointer;
}
</style>

<nav>
    <div class="navbar navbar-expand-lg navbar-main d-none d-lg-flex">
        <a href="index.php" class="navbar-brand" style="width: 10%;" title="Home">
            <img src="logo.png" alt="MinhPhungPC Logo" style="width: 100%;">
        </a>
        <div class="mx-auto" style="width: 50%;">
            <div class="search-input-container">
                <input type="text" class="search-input" id="searchQuery" placeholder="Find component" onkeyup="debouncedSearchComponents('searchQuery')" onkeypress="checkEnter(event, 'searchQuery')">
                <button class="search-button" id="searchBtn" onclick="performSearch('searchQuery')">
                    <i class="fas fa-search"></i>
                </button>
                <div id="desktopSearchDropdown" class="dropdown-menu w-100 p-0"></div>
            </div>
        </div>
        <div class="d-flex align-items-center ml-auto">
            <button id="switchBtn" class="btn btn-link p-0" aria-label="Toggle dark mode">
                <i class="bi bi-moon icon"></i>
            </button>
            <?php if (isset($_SESSION['user_id'])): 
                $stmt = $pdo->prepare("SELECT cart FROM users WHERE user_id = :user_id");
                $stmt->bindParam(':user_id', $_SESSION['user_id'], PDO::PARAM_INT);
                $stmt->execute();
                $cart_data = $stmt->fetchColumn();
                $cart_amount = $cart_data ? count(explode(' ', trim($cart_data))) : 0;
            ?>
                <div class="mx-2">
                    <a href="account.php">
                        <img src="<?= htmlspecialchars($_SESSION['profile_image']); ?>" class="rounded-circle" style="width: 35px; height: 35px;" title="Profile">
                    </a>
                </div>
                <a href="cart.php" class="btn btn-secondary" title="View Cart">
                    <i class="fas fa-shopping-cart"></i> <?= $cart_amount; ?>
                </a>
            <?php else: ?>
                <div class="mx-2">
                    <a href="account.php" class="btn btn-primary" title="Sign In">
                        <i class="fas fa-user"></i>
                    </a>
                </div>
                <a href="account.php" class="btn btn-secondary" title="View Cart">
                    <i class="fas fa-shopping-cart"></i>
                </a>
            <?php endif; ?>
        </div>
    </div>

    <div class="navbar navbar-secondary navbar-gradient d-none d-lg-flex">
        <div class="navbar-collapse">
            <ul class="navbar-nav flex-row w-100">
                <?php foreach ($categoryMap as $category => $tableName): ?>
                    <li class="nav-item flex-fill">
                        <a href="categories.php?table=<?= urlencode($tableName); ?>" class="nav-link" title="Explore <?= htmlspecialchars($category); ?>"><?= htmlspecialchars($category); ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</nav>

<nav class="navbar-mobile-secondary">
    <div class="d-lg-none">
        <div class="d-flex align-items-center p-2 justify-content-between">
            <a href="index.php" class="navbar-brand" style="width: 40%;" title="Home">
                <img src="logo_light.png" alt="MinhPhungPC Logo" style="width: 100%;">
            </a>
            <div class="d-flex align-items-center">
                <button id="switchBtnMobile" class="btn btn-link p-0" aria-label="Toggle dark mode">
                    <i class="bi bi-moon icon"></i>
                </button>
                <?php if (isset($_SESSION['user_id'])): ?>
                    <div class="mx-2">
                        <a href="account.php">
                            <img src="<?= htmlspecialchars($_SESSION['profile_image']); ?>" class="rounded-circle" style="width: 35px; height: 35px;" title="Profile">
                        </a>
                    </div>
                    <a href="cart.php" class="btn btn-secondary" title="View Cart">
                        <i class="fas fa-shopping-cart"></i> <?= $cart_amount; ?>
                    </a>
                <?php else: ?>
                    <div class="mx-2">
                        <a href="account.php" class="btn btn-primary" title="Sign In">
                            <i class="fas fa-user"></i>
                        </a>
                    </div>
                    <a href="account.php" class="btn btn-secondary" title="View Cart">
                        <i class="fas fa-shopping-cart"></i>
                    </a>
                <?php endif; ?>
            </div>
        </div>
        <div class="search-input-container p-2">
            <input type="text" class="form-control search-input" id="mobileSearchQuery" placeholder="Find component" onkeyup="debouncedSearchComponents('mobileSearchQuery')" onkeypress="checkEnter(event, 'mobileSearchQuery')">
            <button class="search-button" id="searchBtnMobile" onclick="performSearch('mobileSearchQuery')">
                <i class="fas fa-search"></i>
            </button>
            <div id="mobileSearchDropdown" class="dropdown-menu w-100 p-0"></div>
        </div>
        <div class="categories">
            <ul class="navbar-nav flex-row" style="white-space: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; color: grey;">
                <?php foreach ($categoryMap as $category => $tableName): ?>
                    <li class="px-1">
                        <a href="categories.php?table=<?= urlencode($tableName); ?>"><?= htmlspecialchars($category); ?></a>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>
    </div>
</nav>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
<script>
    const performSearch = (inputId) => {
        const query = document.getElementById(inputId).value;
        if (query) window.location.href = `search_result.php?query=${encodeURIComponent(query)}`;
    };

    const checkEnter = (event, inputId) => {
        if (event.key === 'Enter') performSearch(inputId);
    };

    let debounceTimer;
    const debouncedSearchComponents = (inputId) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => searchComponents(inputId), 300);
    };

    const searchComponents = (inputId) => {
        const searchQuery = document.getElementById(inputId).value;
        const dropdownId = inputId === 'searchQuery' ? 'desktopSearchDropdown' : 'mobileSearchDropdown';
        const searchDropdown = document.getElementById(dropdownId);

        if (searchQuery.length > 0) {
            searchDropdown.style.display = 'block';
            const xhr = new XMLHttpRequest();
            xhr.open("GET", `_search.php?search=${encodeURIComponent(searchQuery)}`, true);

            xhr.onload = () => {
                const components = JSON.parse(xhr.responseText);
                searchDropdown.innerHTML = components.length
                    ? components.map(component => `
                        <div class="dropdown-item" onclick="window.location.href='item.php?table=${encodeURIComponent(component.item_table)}&id=${encodeURIComponent(component.id)}'" style="display: flex; align-items: center;">
                            <img src="${component.image}" alt="${component.name}" style="width: 60px; height: 60px; margin-right: 10px; background-color: white;">
                            <div style="display: flex; flex-direction: column;">
                                <strong>${component.name}</strong>
                                <span>${new Intl.NumberFormat('vi-VN').format(component.price)}₫</span>
                                <span>${component.brand}</span>
                            </div>
                        </div>`).join('')
                    : "<button class='dropdown-item' disabled>No results found</button>";
            };

            xhr.onerror = () => searchDropdown.innerHTML = "<button class='dropdown-item' disabled>Error loading results</button>";
            xhr.send();
        } else {
            searchDropdown.style.display = 'none';
        }
    };

    document.addEventListener('click', (event) => {
        const searchQueryDesktop = document.getElementById('searchQuery');
        const searchDropdownDesktop = document.getElementById('desktopSearchDropdown');
        const searchQueryMobile = document.getElementById('mobileSearchQuery');
        const searchDropdownMobile = document.getElementById('mobileSearchDropdown');

        if (!searchQueryDesktop.contains(event.target) && !searchDropdownDesktop.contains(event.target)) {
            searchDropdownDesktop.style.display = 'none';
        }

        if (!searchQueryMobile.contains(event.target) && !searchDropdownMobile.contains(event.target)) {
            searchDropdownMobile.style.display = 'none';
        }
    });
</script>