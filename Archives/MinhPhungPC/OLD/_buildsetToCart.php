<?php
include 'db.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'addToCart') {
    if (!isset($_SESSION['user_id'])) {
        $response['message'] = 'You must be logged in!';
        echo json_encode($response);
        exit;
    }

    $stmt = $pdo->prepare("SELECT buildset FROM users WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $buildset = $stmt->fetchColumn();

    if (empty($buildset)) {
        $response['message'] = 'There\'s no components in the build!';
        echo json_encode($response);
        exit;
    }

    $components = explode(' ', $buildset);
    foreach ($components as $component) {
        list($table, $id) = explode('-', $component);
        $amount = 1;
        $userId = $_SESSION['user_id'];

        if ($userId && $table && $id) {
            $cartEntry = "$table-$id-$amount ";
            $stmt = $pdo->prepare("SELECT cart FROM users WHERE user_id = :userId");
            $stmt->bindParam(':userId', $userId);
            $stmt->execute();
            $currentCart = $stmt->fetchColumn();

            if ($currentCart) {
                $items = explode(' ', trim($currentCart));
                $items[] = trim($cartEntry);
                $itemCounts = [];

                foreach ($items as $item) {
                    if ($item) {
                        list($tableItem, $itemId, $qty) = explode('-', $item);
                        $key = "$tableItem-$itemId";
                        $itemCounts[$key] = ($itemCounts[$key] ?? 0) + (int)$qty;
                    }
                }

                $updatedCart = [];
                foreach ($itemCounts as $key => $qty) {
                    $updatedCart[] = "$key-$qty";
                }

                sort($updatedCart);
                $updatedCartString = implode(' ', $updatedCart);
            } else {
                $updatedCartString = trim($cartEntry);
            }

            $stmt = $pdo->prepare("UPDATE users SET cart = :cart WHERE user_id = :userId");
            $stmt->bindParam(':cart', $updatedCartString);
            $stmt->bindParam(':userId', $userId);

            if (!$stmt->execute()) {
                $response['message'] = 'Failed to add item to cart.';
                echo json_encode($response);
                exit;
            }
        }
    }

    $stmt = $pdo->prepare("UPDATE users SET buildset = '' WHERE user_id = ?");
    $stmt->execute([$_SESSION['user_id']]);

    $response['success'] = true;
    echo json_encode($response);
}
?>