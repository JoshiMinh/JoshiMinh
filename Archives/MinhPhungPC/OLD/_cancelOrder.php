<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $orderId = $input['order_id'] ?? null;
    $userId = $_SESSION['user_id'];

    $response = ['success' => false];
    if ($orderId) {
        $stmt = $pdo->prepare("UPDATE orders SET status = 'cancelled' WHERE order_id = ? AND customer_id = ?");
        $response['success'] = $stmt->execute([$orderId, $userId]);
        if (!$response['success']) $response['error'] = 'Database error.';
    } else {
        $response['error'] = 'Invalid request.';
    }
    echo json_encode($response);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
?>