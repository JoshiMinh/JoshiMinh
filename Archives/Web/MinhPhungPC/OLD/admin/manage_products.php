<?php
include('../scripts/tableColumns.php');

if (empty($active) || $active !== true) {
    header("Location: index.php");
    exit();
}

$view = $_GET['view'] ?? '';
$searchQuery = $_GET['search'] ?? '';

$results = [];

if (!empty($searchQuery)) {
    foreach ($components as $tableName => $columns) {
        if (in_array('name', $columns) && in_array('brand', $columns)) {
            $sql = "SELECT id, name, brand, price, image, '$tableName' AS type 
                    FROM $tableName 
                    WHERE name LIKE ? OR brand LIKE ? 
                    ORDER BY brand ASC, price DESC 
                    LIMIT 20";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(["%$searchQuery%", "%$searchQuery%"]);
            $results = array_merge($results, $stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_item'])) {
    $table = $_POST['table'];
    $id = $_POST['id'];
    $pdo->prepare("DELETE FROM $table WHERE id = ?")->execute([$id]);
    header("Location: index.php?view=$view&search=$searchQuery");
    exit();
}
?>

<div class="container text-light">
    <h2 class="my-2">Manage Products</h2>

    <div class="row mt-4">
        <div class="col-12">
            <div class="card bg-dark text-light">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <form method="GET" class="mb-0">
                        <input type="hidden" name="view" value="<?= htmlspecialchars($view) ?>">
                        <label for="searchQuery" class="text-light">Search Products: </label>
                        <input type="text" name="search" id="searchQuery" placeholder="Search by name or brand" class="form-control" style="width:auto; display:inline-block;" value="<?= htmlspecialchars($searchQuery) ?>">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </form>
                    <a href="index.php?view=add_or_edit_product" class="btn btn-success">Add</a>
                </div>
                <div class="card-body scrollable-card p-0">
                    <table class="table table-dark table-striped text-light" id="productTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Brand</th>
                                <th>Price (VNĐ)</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($results as $item): ?>
                                <tr>
                                    <td><?= htmlspecialchars($item['id']) ?></td>
                                    <td><?= htmlspecialchars($item['name']) ?></td>
                                    <td><?= htmlspecialchars($item['type']) ?></td>
                                    <td><?= htmlspecialchars($item['brand']) ?></td>
                                    <td><?= number_format($item['price'], 0, ',', '.') ?> VNĐ</td>
                                    <td>
                                        <img src="<?= htmlspecialchars($item['image']) ?>" alt="Product Image" width="50" class="product-image" data-bs-toggle="modal" data-bs-target="#imageModal" data-image="<?= htmlspecialchars($item['image']) ?>">
                                    </td>
                                    <td>
                                        <a href="index.php?view=add_or_edit_product&product_id=<?= $item['id'] ?>&table=<?= $item['type'] ?>" class="btn btn-primary btn-sm">Edit</a>
                                        <form method="POST" style="display:inline-block;">
                                            <input type="hidden" name="id" value="<?= $item['id'] ?>">
                                            <input type="hidden" name="table" value="<?= $item['type'] ?>">
                                            <button type="submit" name="delete_item" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this product?');">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content bg-dark text-light">
            <div class="modal-header">
                <h5 class="modal-title" id="imageModalLabel">Product Image</h5>
                <button type="button" class="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center">
                <img src="" alt="Product Image" id="modalImage" class="img-fluid">
            </div>
        </div>
    </div>
</div>

<script>
    document.querySelectorAll('.product-image').forEach(function(imageElement) {
        imageElement.addEventListener('click', function() {
            const imageUrl = this.getAttribute('data-image');
            document.getElementById('modalImage').src = imageUrl;
        });
    });
</script>

<style>
    .product-image:hover {
        cursor: pointer;
    }
</style>