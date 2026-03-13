<?php
if (empty($active) || $active !== true) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = $_POST['order_id'] ?? null;
    $newStatus = $_POST['status'] ?? null;
    $newPaymentStatus = $_POST['payment_status'] ?? null;

    if ($orderId && ($newStatus || $newPaymentStatus)) {
        $pdo->prepare("UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE order_id = ?")
            ->execute([$newStatus, $newPaymentStatus, $orderId]);
    }
    exit();
}

$totalRevenue = $pdo->query("SELECT COALESCE(SUM(total_amount), 0) FROM orders")->fetchColumn();
$totalOrders = $pdo->query("SELECT COUNT(*) FROM orders")->fetchColumn();
$view = $_GET['view'] ?? '';
$searchQuery = $_GET['search'] ?? '';
$recentOrdersStmt = $pdo->prepare("SELECT o.order_id, o.customer_id, o.items, o.order_date, o.status, o.total_amount, o.address, o.payment_method, o.payment_status, u.name AS customer_name 
    FROM orders o 
    JOIN users u ON o.customer_id = u.user_id 
    WHERE u.name LIKE ? OR o.order_id LIKE ? 
    ORDER BY o.order_date DESC LIMIT 20");
$recentOrdersStmt->execute(["%$searchQuery%", "%$searchQuery%"]);
?>

<div class="container text-light">
    <h2 class="my-2">Admin Dashboard</h2>
    <div class="row">
        <div class="col-md-6">
            <div class="card bg-dark text-light">
                <div class="card-header text-secondary">Total Revenue</div>
                <div class="card-body">
                    <h5 class="card-title text-success"><?= number_format($totalRevenue) ?>₫</h5>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <div class="card bg-dark text-light">
                <div class="card-header text-secondary">Total Orders</div>
                <div class="card-body">
                    <h5 class="card-title"><?= $totalOrders ?> Orders</h5>
                </div>
            </div>
        </div>
    </div>
    <div class="row mt-4">
        <div class="col-12">
            <div class="card bg-dark text-light">
                <div class="card-header text-secondary">
                    <form method="GET">
                        <input type="hidden" name="view" value="<?= htmlspecialchars($view) ?>">
                        <label for="searchQuery" class="text-light">Search Orders: </label>
                        <input type="text" name="search" id="searchQuery" placeholder="Search by customer name or order ID" class="form-control" style="width:auto; display:inline-block;" value="<?= htmlspecialchars($searchQuery) ?>">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </form>
                </div>
                <div class="card-body scrollable-card p-0">
                    <table class="table table-dark table-striped text-light">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer Name</th>
                                <th>Items</th>
                                <th>Order Date</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>Payment Method</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($order = $recentOrdersStmt->fetch(PDO::FETCH_ASSOC)): ?>
                                <tr>
                                    <td><?= htmlspecialchars($order['order_id']) ?></td>
                                    <td><?= htmlspecialchars($order['customer_name']) ?></td>
                                    <td>
                                        <?php
                                        $itemsDetails = array_map(function ($item) use ($pdo) {
                                            list($table, $id, $quantity) = explode('-', $item);
                                            $stmt = $pdo->prepare("SELECT name, price FROM $table WHERE id = ?");
                                            $stmt->execute([$id]);
                                            $detail = $stmt->fetch(PDO::FETCH_ASSOC);
                                            return $detail ? htmlspecialchars($detail['name']) . " (" . number_format($detail['price'], 0, ',', '.') . "₫) x$quantity" : '';
                                        }, explode(' ', $order['items']));
                                        ?>
                                        <p class="card-text"><?= implode(', ', $itemsDetails) ?></p>
                                    </td>
                                    <td><?= htmlspecialchars($order['order_date']) ?></td>
                                    <td class="text-success"><?= number_format($order['total_amount'], 2) ?>₫</td>
                                    <td>
                                        <select name="status" data-id="<?= htmlspecialchars($order['order_id']) ?>">
                                            <option value="pending" <?= $order['status'] === 'pending' ? 'selected' : '' ?>>Pending</option>
                                            <option value="processed" <?= $order['status'] === 'processed' ? 'selected' : '' ?>>Processed</option>
                                            <option value="shipped" <?= $order['status'] === 'shipped' ? 'selected' : '' ?>>Shipped</option>
                                            <option value="delivered" <?= $order['status'] === 'delivered' ? 'selected' : '' ?>>Delivered</option>
                                        </select>
                                    </td>
                                    <td><?= htmlspecialchars($order['address']) ?></td>
                                    <td><?= htmlspecialchars($order['payment_method']) ?></td>
                                    <td>
                                        <select name="payment_status" data-id="<?= htmlspecialchars($order['order_id']) ?>">
                                            <option value="pending" <?= $order['payment_status'] === 'pending' ? 'selected' : '' ?>>Pending</option>
                                            <option value="paid" <?= $order['payment_status'] === 'paid' ? 'selected' : '' ?>>Paid</option>
                                            <option value="cancelled" <?= $order['payment_status'] === 'cancelled' ? 'selected' : '' ?>>Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('select[name="status"], select[name="payment_status"]').forEach(select => {
        select.addEventListener('change', () => {
            const orderId = select.dataset.id;
            const formData = new FormData();
            formData.append('order_id', orderId);
            formData.append(select.name, select.value);

            fetch('_update_order.php', { method: 'POST', body: formData })
                .then(response => response.json())
                .then(data => {
                    if (data.success) alert('Order updated successfully!');
                    else alert('Error updating order: ' + data.error);
                })
                .catch(error => alert('Network error: ' + error.message));
        });
    });
});
</script>