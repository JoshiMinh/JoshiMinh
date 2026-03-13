<?php
$userId = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT name FROM users WHERE user_id = ?");
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

$stmt = $pdo->prepare("SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC");
$stmt->execute([$userId]);
$orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

$items = [];
foreach ($orders as $order) {
    foreach (explode(' ', $order['items']) as $item) {
        list($itemTable, $itemId) = explode('-', $item);
        $items[$itemTable][] = $itemId;
    }
}

$itemDetailsMap = [];
foreach ($items as $table => $ids) {
    $placeholders = rtrim(str_repeat('?,', count($ids)), ',');
    $stmt = $pdo->prepare("SELECT id, name, price FROM $table WHERE id IN ($placeholders)");
    $stmt->execute($ids);
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $itemDetailsMap[$table][$row['id']] = $row;
    }
}
?>

<main class="container my-4">
    <?php if ($orders): ?>
        <?php foreach ($orders as $index => $order): ?>
            <div class="card mb-4 p-1" id="order-<?= $order['order_id'] ?>">
                <div class="card-body">
                    <h4 class="card-title">Order #<?= count($orders) - $index ?></h4>
                    <?php
                    $statusClass = match ($order['status']) {
                        'cancelled' => 'text-danger',
                        'delivered' => 'text-success',
                        default => ''
                    };
                    ?>
                    <div class="row">
                        <div class="col-md-6">
                            <p class="card-text"><strong>Date:</strong> <?= htmlspecialchars($order['order_date']) ?></p>
                            <p class="card-text"><strong>Status:</strong> <span class="<?= $statusClass ?>" id="status-<?= $order['order_id'] ?>"><?= ucfirst(htmlspecialchars($order['status'])) ?></span></p>
                            <p class="card-text"><strong>Total Amount:</strong> <?= number_format($order['total_amount'], 0, ',', '.') ?>₫</p>
                        </div>
                        <div class="col-md-6">
                            <p class="card-text"><strong>Address:</strong> <?= htmlspecialchars($order['address']) ?></p>
                            <p class="card-text"><strong>Payment Method:</strong> <?= htmlspecialchars($order['payment_method']) ?></p>
                            <p class="card-text"><strong>Payment Status:</strong> <?= ucfirst(htmlspecialchars($order['payment_status'])) ?></p>
                        </div>
                    </div>
                    <?php
                    $itemsDetails = array_map(function ($item) use ($itemDetailsMap) {
                        list($table, $id, $quantity) = explode('-', $item);
                        if (isset($itemDetailsMap[$table][$id])) {
                            $detail = $itemDetailsMap[$table][$id];
                            return htmlspecialchars($detail['name']) . " (" . number_format($detail['price'], 0, ',', '.') . "₫) x$quantity";
                        }
                        return '';
                    }, explode(' ', $order['items']));
                    ?>
                    <p class="card-text mt-4"><strong>Items:</strong> <?= implode(', ', $itemsDetails) ?></p>
                    <?php if (!in_array($order['status'], ['delivered', 'shipped', 'cancelled'])): ?>
                        <button class="btn btn-danger cancel-order-btn" data-toggle="modal" data-target="#cancelModal" data-order-id="<?= $order['order_id'] ?>">Cancel Order</button>
                    <?php endif; ?>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <div class="alert alert-warning">You have no order history.</div>
    <?php endif; ?>
</main>

<div class="modal fade" id="cancelModal" tabindex="-1" role="dialog" aria-labelledby="cancelModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="cancelModalLabel">Cancel Order</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">Are you sure you want to cancel this order?</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" id="confirmCancel">Yes, Cancel Order</button>
            </div>
        </div>
    </div>
</div>

<script>
    let currentOrderId = null;
    document.querySelectorAll('.cancel-order-btn').forEach(button => button.addEventListener('click', function () {
        currentOrderId = this.dataset.orderId;
    }));
    document.getElementById('confirmCancel').addEventListener('click', function () {
        if (!currentOrderId) return;
        fetch('_cancelOrder.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: currentOrderId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const statusElement = document.getElementById(`status-${currentOrderId}`);
                statusElement.textContent = 'Cancelled';
                statusElement.classList.add('text-danger');
                document.querySelector(`[data-order-id='${currentOrderId}']`).style.display = 'none';
                $('#cancelModal').modal('hide');
            } else alert('Error cancelling order: ' + data.error);
        })
        .catch(error => alert('Unexpected error: ' + error));
    });
</script>