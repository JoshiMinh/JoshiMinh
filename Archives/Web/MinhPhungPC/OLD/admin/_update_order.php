<?php
include 'db_conn.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $orderId = $_POST['order_id'] ?? null;
    $newStatus = $_POST['status'] ?? null;
    $newPaymentStatus = $_POST['payment_status'] ?? null;

    if ($orderId && ($newStatus || $newPaymentStatus)) {
        try {
            $pdo->prepare("UPDATE orders SET status = COALESCE(?, status), payment_status = COALESCE(?, payment_status) WHERE order_id = ?")
                ->execute([$newStatus, $newPaymentStatus, $orderId]);
            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid input']);
    }
    exit();
}

http_response_code(405);
echo json_encode(['success' => false, 'error' => 'Invalid request method']);
?>