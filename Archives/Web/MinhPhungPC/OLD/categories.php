<?php
include 'db.php';
include 'scripts/categoryMap.php';

$table = $_GET['table'] ?? '';
$tableName = array_search($table, $categoryMap) ?: 'Unknown Category';
$tableDisplayName = htmlspecialchars(ucwords(str_replace('_', ' ', $tableName)));

$brands = $items = [];
$brandFilter = $_GET['brands'] ?? [];
$minPrice = $_GET['min_price'] ?? null;
$maxPrice = $_GET['max_price'] ?? null;

if ($tableName !== 'Unknown Category') {
    try {
        $stmtBrands = $pdo->query("SELECT DISTINCT brand FROM $table ORDER BY brand");
        $brands = $stmtBrands->fetchAll(PDO::FETCH_ASSOC);

        $stmtPriceRange = $pdo->query("SELECT MIN(price) AS min_price, MAX(price) AS max_price FROM $table");
        $priceRange = $stmtPriceRange->fetch(PDO::FETCH_ASSOC);

        $minPrice = $minPrice ?: $priceRange['min_price'];
        $maxPrice = $maxPrice ?: $priceRange['max_price'];

        $minPriceNumeric = (float)preg_replace('/[^\d]/', '', $minPrice);
        $maxPriceNumeric = (float)preg_replace('/[^\d]/', '', $maxPrice);

        $formattedMinPrice = number_format($minPriceNumeric, 0, ',', '.');
        $formattedMaxPrice = number_format($maxPriceNumeric, 0, ',', '.');

        $brandCondition = $brandFilter
            ? "AND brand IN ('" . implode("','", array_map('htmlspecialchars', $brandFilter)) . "')"
            : '';

        $priceCondition = "AND price BETWEEN :min_price AND :max_price";

        $stmtItems = $pdo->prepare("SELECT *, '$table' AS item_table FROM $table WHERE 1 $brandCondition $priceCondition ORDER BY brand");
        $stmtItems->bindParam(':min_price', $minPriceNumeric, PDO::PARAM_INT);
        $stmtItems->bindParam(':max_price', $maxPriceNumeric, PDO::PARAM_INT);
        $stmtItems->execute();
        $items = $stmtItems->fetchAll(PDO::FETCH_ASSOC);

        include 'scripts/sort_by.php';
    } catch (PDOException $e) {
        echo "Error fetching data: " . htmlspecialchars($e->getMessage());
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $tableDisplayName ?> - MinhPhungPC</title>
    <link rel="icon" href="icon.png" type="image/png">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        .sidebar-container { position: sticky; height: 100%; background-color: var(--bg-elevated); padding: 1.75rem; }
        .content-container { padding: 1rem; }
        .card { min-width: 200px; }
        .card img { height: auto; max-width: 100%; object-fit: contain; }
        .form-inline input { width: 45%; }
        .price-caption { font-size: 0.9rem; color: #6c757d; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="content">
        <?php include 'web_sections/navbar.php'; ?>
        <?php include 'scripts/add_to_cart.php'; ?>
        <h2 class="text-center my-3"><?= $tableDisplayName ?></h2>
        <div class="container-fluid my-1 mx-1">
            <div class="row">
                <?php if ($brands || $minPrice || $maxPrice): ?>
                    <div class="col-12 col-md-3 sidebar-container">
                        <h5>Filter by Price (₫)</h5>
                        <form method="get">
                            <input type="hidden" name="table" value="<?= htmlspecialchars($table) ?>">
                            <div class="form-inline mb-3">
                                <div class="form-group mb-2 w-100">
                                    <label for="minPrice" class="mr-2">Min Price: </label>
                                    <input type="text" class="form-control w-100" id="minPrice" name="min_price"
                                        value="<?= $formattedMinPrice ?>" data-price="<?= $minPriceNumeric ?>"
                                        oninput="formatPriceInput(this)">
                                </div>
                                <div class="form-group mb-2 w-100">
                                    <label for="maxPrice" class="mr-2">Max Price:</label>
                                    <input type="text" class="form-control w-100" id="maxPrice" name="max_price"
                                        value="<?= $formattedMaxPrice ?>" data-price="<?= $maxPriceNumeric ?>"
                                        oninput="formatPriceInput(this)">
                                </div>
                            </div>
                            <?php if ($brands): ?>
                                <h5>Filter by Brand</h5>
                                <?php foreach ($brands as $brand): ?>
                                    <div class="form-check">
                                        <input type="checkbox" class="form-check-input" 
                                            id="brand-<?= htmlspecialchars($brand['brand']) ?>"
                                            name="brands[]" value="<?= htmlspecialchars($brand['brand']) ?>"
                                            <?= in_array($brand['brand'], $brandFilter) ? 'checked' : '' ?>>
                                        <label class="form-check-label" for="brand-<?= htmlspecialchars($brand['brand']) ?>">
                                            <?= htmlspecialchars($brand['brand']) ?>
                                        </label>
                                    </div>
                                <?php endforeach; ?>
                            <?php endif; ?>
                            <button type="submit" class="btn btn-primary btn-sm mt-3 w-100">Filter</button>
                        </form>
                    </div>
                <?php endif; ?>

                <div class="col-12 col-md-9 content-container">
                    <?php if ($items): include 'web_sections/item_display.php' ?>
                    <?php else: ?>
                        <div class="alert alert-warning">No items found.</div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
    <?php include 'web_sections/footer.php'; ?>
</div>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="darkmode.js"></script>
<script src="scrolledPosition.js"></script>
<script>
    function formatPriceInput(input) {
        let value = input.value.replace(/[^\d]/g, '');
        input.value = new Intl.NumberFormat('de-DE').format(value);
    }
</script>
</body>
</html>