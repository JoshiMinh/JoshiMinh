<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['table'], $_POST['id'])) {
    if (!isset($_SESSION['user_id'])) {
        echo "<script>alert('You must be logged in to add items to the cart.');</script>";
        echo "<script>window.location.href = window.location.href;</script>";
        exit;
    }

    $table = $_POST['table'];
    $id = $_POST['id'];
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

                    if (!isset($itemCounts[$key])) {
                        $itemCounts[$key] = 0;
                    }
                    $itemCounts[$key] += (int)$qty;
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

        if ($stmt->execute()) {
            echo "<script>window.location.href = window.location.href;</script>";
        } else {
            echo "<script>alert('Failed to add item to cart.');</script>";
            echo "<script>window.location.href = window.location.href;</script>";
        }
    }
}
?>