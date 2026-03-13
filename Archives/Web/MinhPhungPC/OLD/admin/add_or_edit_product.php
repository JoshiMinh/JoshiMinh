<?php
include('../scripts/tableColumns.php');

if (empty($active) || !$active) {
    header("Location: index.php");
    exit();
}

$product_id = $_GET['product_id'] ?? '';
$table = $_GET['table'] ?? '';
$view = $_GET['view'] ?? '';
$addAction = !$product_id && !$table;

if (!$addAction) {
    $stmt = $pdo->prepare("SELECT * FROM $table WHERE id = ?");
    $stmt->execute([$product_id]);
    $product = $stmt->fetch(PDO::FETCH_ASSOC);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['delete'])) {
        $stmt = $pdo->prepare("DELETE FROM $table WHERE id = ?");
        $stmt->execute([$_POST['product_id']]);
        header("Location: index.php?view=manage_products");
        exit();
    }

    if (isset($_POST['add'])) {
        $table = $_POST['selected_table'];
        if (!isset($components[$table])) {
            die("Invalid table selected");
        }
        $stmt = $pdo->prepare("INSERT INTO `$table` (name, price, brand, image) VALUES (?, ?, ?, ?)");
        $stmt->execute([$_POST['name'], $_POST['price'], $_POST['brand'], $_POST['image']]);
        $newProductId = $pdo->lastInsertId();
        header("Location: index.php?view=$view&product_id=$newProductId&table=$table");
        exit();
    }

    if (isset($_POST['update'])) {
        $query = "UPDATE $table SET name = ?, price = ?, brand = ?, image = ?";
        $params = [$_POST['name'], $_POST['price'], $_POST['brand'], $_POST['image']];
        foreach ($components[$table] as $field) {
            if (!in_array($field, ['id', 'name', 'brand', 'price', 'image'])) {
                $query .= ", $field = ?";
                $params[] = $_POST[$field];
            }
        }
        $query .= " WHERE id = ?";
        $params[] = $product_id;
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        header("Location: index.php?view=$view&product_id=$product_id&table=$table");
        exit();
    }
}
?>
<style>
    .form-control {
        border: 1px solid var(--border-color);
        background: var(--bg-secondary);
        color: var(--text-primary);
    }

    .form-control:focus {
        background: var(--bg-secondary);
        color: var(--text-primary);
    }
</style>

<div class="container text-light my-4">
    <h3 class="text-center"><?= $addAction ? 'Add Product' : 'Edit Product' ?></h3>

    <form method="POST" class="col-md-9 mx-auto">
        <?php if (!$addAction): ?>
            <div class="mb-3 text-center">
                <img src="<?= $product['image'] ?? '' ?>" alt="Product Image" class="img-fluid" style="max-width: 450px;">
            </div>
        <?php endif; ?>

        <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" id="name" name="name" class="form-control" value="<?= $product['name'] ?? '' ?>" required>
        </div>
        <div class="mb-3">
            <label for="price" class="form-label">Price (VNĐ)</label>
            <input 
                type="text" 
                id="price" 
                name="price" 
                class="form-control" 
                value="<?= isset($product['price']) ? number_format($product['price']) : '' ?>" 
                oninput="formatPrice(this)" 
                required
            >
        </div>
        <div class="mb-3">
            <label for="brand" class="form-label">Brand</label>
            <input type="text" id="brand" name="brand" class="form-control" value="<?= $product['brand'] ?? '' ?>" required>
        </div>
        <div class="mb-3">
            <label for="image" class="form-label">Image (URL)</label>
            <input type="text" id="image" name="image" class="form-control" value="<?= $product['image'] ?? '' ?>" required>
        </div>

        <?php if (!$addAction): ?>
            <hr>
            <?php foreach ($components[$table] as $field): ?>
                <?php if (!in_array($field, ['id', 'name', 'brand', 'price', 'image'])): ?>
                    <div class="mb-3">
                        <label for="<?= $field ?>" class="form-label"><?= ucfirst(str_replace('_', ' ', $field)) ?></label>
                        <input type="text" id="<?= $field ?>" name="<?= $field ?>" class="form-control" value="<?= $product[$field] ?? '' ?>" required>
                    </div>
                <?php endif; ?>
            <?php endforeach; ?>
            
            <div class="mb-3 text-center">
                <button type="submit" name="update" class="btn btn-primary">Update</button>
                <button type="submit" name="delete" class="btn btn-danger" onclick="return confirmDelete()">Delete</button>
                <input type="hidden" name="product_id" value="<?= $product['id'] ?? '' ?>">
            </div>
        <?php else: ?>
            <div class="mb-3">
                <div class="d-flex flex-wrap">
                    <?php foreach ($components as $key => $fields): ?>
                        <div class="form-check me-3 mb-2">
                            <input class="form-check-input" type="radio" name="selected_table" id="<?= $key ?>" value="<?= $key ?>" <?= $key === $table ? 'checked' : '' ?>>
                            <label class="form-check-label" for="<?= $key ?>"><?= ucfirst($key) ?></label>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>

            <div class="mb-3 text-center">
                <button type="submit" name="add" class="btn btn-success">Add Product</button>
            </div>
        <?php endif; ?>
    </form>
</div>

<script>
    function confirmDelete() {
        return confirm('Are you sure you want to delete this product?');
    }

    function formatPrice(input) {
        let value = input.value.replace(/[^0-9]/g, '');
        input.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    function stripFormatting(input) {
        input.value = input.value.replace(/,/g, '');
    }

    window.onload = function() {
        const priceField = document.getElementById('price');
        if (priceField) {
            formatPrice(priceField);
            priceField.addEventListener('blur', () => formatPrice(priceField));
            priceField.form.addEventListener('submit', () => stripFormatting(priceField));
        }
    };
</script>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>