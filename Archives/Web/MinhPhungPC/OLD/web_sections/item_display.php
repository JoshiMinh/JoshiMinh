<div class="col-12 col-md-3 mb-3">
    <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle w-100" type="button" id="sortDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Sort By <?= ucfirst(strtolower($_GET['sort'] ?? '')) ?>
        </button>
        <ul class="dropdown-menu" aria-labelledby="sortDropdown">
            <li><a class="dropdown-item" href="?<?= http_build_query(array_merge($_GET, ['sort' => 'highest'])) ?>">Highest Price</a></li>
            <li><a class="dropdown-item" href="?<?= http_build_query(array_merge($_GET, ['sort' => 'cheapest'])) ?>">Cheapest Price</a></li>
        </ul>
    </div>
</div>

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

<div class="container">
    <div class="row">
        <?php foreach ($items as $index => $item): ?>
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 slide-up" style="animation-delay: <?= $index * 0.1 ?>s;">
                <div class="card h-100 text-dark p-0" style="border: none; border-radius: 10px; background-color: var(--bg-elevated);">
                    <a href="item.php?table=<?= urlencode($item['item_table']) ?>&id=<?= urlencode($item['id']) ?>" class="nav-link">
                        <img src="<?= htmlspecialchars($item['image']) ?>" 
                             alt="<?= htmlspecialchars($item['name']) ?>" 
                             class="card-img-top" 
                             style="height: 200px; object-fit: cover; background-color: white;">
                    </a>
                    <div class="card-body">
                        <p class="card-text mb-2" style="font-family: 'Roboto', sans-serif; font-weight: 100; font-size: 1.1rem;">
                            <strong><?= number_format($item['price'], 0, ',', '.') . '₫' ?></strong>
                        </p>
                        <h6 class="card-title h6 mb-0">
                            <?= htmlspecialchars($item['name']) ?>
                        </h6>
                    </div>
                    <div class="card-footer d-flex" style="padding: 0; height: 50px; border: none;">
                        <form method="post" style="flex: 7; height: 100%; margin: 0;">
                            <input type="hidden" name="table" value="<?= htmlspecialchars($item['item_table']) ?>">
                            <input type="hidden" name="id" value="<?= htmlspecialchars($item['id']) ?>">
                            <button type="submit" class="btn btn-primary btn-sm w-100 h-100" style="border-radius: 0;">Add to Cart</button>
                        </form>
                        <a href="item.php?table=<?= urlencode($item['item_table']) ?>&id=<?= urlencode($item['id']) ?>">
                            <button class="btn btn-secondary w-100 h-100" style="flex: 3; border-radius: 0;">View</button>
                        </a>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>