<?php
include 'db.php';

$user_id = $_SESSION['user_id'] ?? 0;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['remove_all'])) {
        $stmt = $pdo->prepare("UPDATE users SET cart = '' WHERE user_id = ?");
        $stmt->execute([$user_id]);
        header("Location: cart.php");
        exit();
    }

    if (isset($_POST['remove_item'])) {
        $item_to_remove = $_POST['remove_item'];
        $stmt = $pdo->prepare("SELECT cart FROM users WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $cart_data = $stmt->fetchColumn();

        $updated_cart = '';
        $cart_items_raw = explode(' ', $cart_data);
        foreach ($cart_items_raw as $item) {
            if (strpos($item, $item_to_remove) === false) {
                $updated_cart .= $item . ' ';
            }
        }

        $updated_cart = rtrim($updated_cart);
        $stmt = $pdo->prepare("UPDATE users SET cart = ? WHERE user_id = ?");
        $stmt->execute([$updated_cart, $user_id]);
        header("Location: cart.php");
        exit();
    }

    if (isset($_POST['update_quantity'])) {
        $table = $_POST['table'];
        $id = $_POST['id'];
        $quantity = (int)$_POST['quantity'];

        $stmt = $pdo->prepare("SELECT cart FROM users WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $cart_data = $stmt->fetchColumn();

        $updated_cart = '';
        $cart_items_raw = explode(' ', $cart_data);
        foreach ($cart_items_raw as $item) {
            $item_parts = explode('-', $item);
            if (count($item_parts) === 3 && $item_parts[0] === $table && $item_parts[1] == $id) {
                $item_parts[2] = $quantity;
            }
            $updated_cart .= implode('-', $item_parts) . ' ';
        }

        $updated_cart = rtrim($updated_cart);
        $stmt = $pdo->prepare("UPDATE users SET cart = ? WHERE user_id = ?");
        $stmt->execute([$updated_cart, $user_id]);

        $totalAmount = 0;
        $cart_items = [];
        $cart_items_raw = explode(' ', $updated_cart);
        foreach ($cart_items_raw as $item) {
            $item_parts = explode('-', $item);
            if (count($item_parts) === 3) {
                $cart_items[] = [
                    'table' => $item_parts[0],
                    'id' => $item_parts[1],
                    'amount' => (int)$item_parts[2]
                ];
            }
        }

        foreach ($cart_items as $item) {
            $stmt = $pdo->prepare("SELECT price FROM {$item['table']} WHERE id = ?");
            $stmt->execute([$item['id']]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($product) {
                $totalAmount += $product['price'] * $item['amount'];
            }
        }

        header('Content-Type: application/json');
        echo json_encode(['newTotal' => number_format($totalAmount, 0, ',', '.') . '₫']);
        exit();
    }

    if (isset($_POST['place_order'])) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $phone = $_POST['phone'];
        $address = $_POST['address'];
        $payment_method = $_POST['payment_method'];
    
        $stmt = $pdo->prepare("SELECT cart FROM users WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $cart_data = $stmt->fetchColumn();
    
        if (!empty($cart_data)) {
            $totalAmount = 0;
            $cart_items_raw = explode(' ', $cart_data);
            foreach ($cart_items_raw as $item) {
                $item_parts = explode('-', $item);
                if (count($item_parts) === 3) {
                    $stmt = $pdo->prepare("SELECT price FROM {$item_parts[0]} WHERE id = ?");
                    $stmt->execute([$item_parts[1]]);
                    $product = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($product) {
                        $totalAmount += $product['price'] * $item_parts[2];
                    }
                }
            }
    
            $stmt = $pdo->prepare("INSERT INTO orders (customer_id, items, order_date, status, total_amount, address, payment_method, payment_status)
                                   VALUES (?, ?, NOW(), 'pending', ?, ?, ?, 'pending')");
            $stmt->execute([
                $user_id,
                $cart_data,
                $totalAmount,
                $address,
                $payment_method
            ]);
    
            $stmt = $pdo->prepare("UPDATE users SET cart = '' WHERE user_id = ?");
            $stmt->execute([$user_id]);

            $_SESSION['order_success'] = true;

            header("Location: cart.php");
            exit();
        }
    }
}

if (isset($_SESSION['order_success'])) {
    echo "<script>window.addEventListener('load', function() { alert('Your order has been successfully placed.'); });</script>";
    unset($_SESSION['order_success']); // Clear the session variable after displaying the alert
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart</title>
    <link rel="icon" href="icon.png" type="image/png">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        .cart-item { 
            background-color: var(--bg-secondary);
            border-radius: 5px; 
            padding: 15px; 
            margin-bottom: 20px; 
            display: flex; 
            align-items: center; 
            position: relative; 
        }
        .cart-item img { 
            max-width: 100px; 
            margin-right: 20px; 
        }
        .cart-item-details { 
            flex: 1; 
        }
        .price {
            font-size: 110%;
            margin-bottom: 10px;
        }
        .brand {
            font-size: 1rem; 
            margin-bottom: 10px; 
        }
        .quantity { 
            display: flex; 
            align-items: center; 
        }
        .quantity-btn { 
            font-size: 1.5rem; 
            margin: 0 10px; 
            cursor: pointer; 
            background-color: none;
            border: none;
        }
        .quantity-btn:hover{
            text-decoration: none;

        }
        .remove-item-btn { 
            position: absolute; 
            top: -5px; 
            right: 5px; 
            background: none; 
            border: none; 
            font-size: 1.7rem; 
            color: lightcoral; 
            cursor: pointer; 
        }
        .modal-content{
            background-color: var(--bg-elevated);
            color: var(--text-primary);
        }
        .cart-actions { 
            display: flex; 
            gap: 10px; 
            justify-content: flex-end; 
        }
        .cart-actions button { 
            font-size: 1rem; 
        }
        .totalAmount {
            font-size: 110%;
            font-weight: bold;
        }
    </style>
</head>
<body style="transition: 0.5s;">

<div class="wrapper">
    <div class="content">
        <?php include 'web_sections/navbar.php'; ?>
        <main class="container my-4">
            <?php
            $stmt = $pdo->prepare("SELECT cart FROM users WHERE user_id = ?");
            $stmt->execute([$user_id]);
            $cart_data = $stmt->fetchColumn();

            $cart_items = [];
            $totalAmount = 0;

            if (!empty($cart_data)) {
                $cart_items_raw = explode(' ', $cart_data);
                foreach ($cart_items_raw as $item) {
                    $item_parts = explode('-', $item);
                    if (count($item_parts) === 3) {
                        $cart_items[] = [
                            'table' => $item_parts[0],
                            'id' => $item_parts[1],
                            'amount' => (int)$item_parts[2]
                        ];
                    }
                }

                $cart_html = '';
                foreach ($cart_items as $item) {
                    $stmt = $pdo->prepare("SELECT name, price, brand, image FROM {$item['table']} WHERE id = ?");
                    $stmt->execute([$item['id']]);
                    $product = $stmt->fetch(PDO::FETCH_ASSOC);

                    if ($product) {
                        $totalAmount += $product['price'] * $item['amount'];
                        $cart_html .= '
                            <div class="cart-item h-100 bg-white text-dark shadow rounded">
                                <form method="post" style="position: absolute; top: -5px; right: 5px;">
                                    <input type="hidden" name="remove_item" value="' . htmlspecialchars($item['table']) . '-' . htmlspecialchars($item['id']) . '">
                                    <button class="remove-item-btn" type="submit">&times;</button>
                                </form>
                                <a href="item.php?table=' . urlencode($item['table']) . '&id=' . urlencode($item['id']) . '">
                                    <img src="' . htmlspecialchars($product['image']) . '" alt="' . htmlspecialchars($product['name']) . '">
                                </a>
                                <div class="cart-item-details">
                                    <h5>' . htmlspecialchars($product['name']) . '</h5>
                                    <p class="price text-success">' . number_format($product['price'], 0, ',', '.') . '₫</p>
                                    <p class="brand">' . htmlspecialchars($product['brand']) . '</p>
                                </div>
                                <div class="quantity">
                                    <a class="quantity-btn" onclick="updateQuantity(' . $item['id'] . ', -1, \'' . $item['table'] . '\')"><</a>
                                    <span>' . (int)$item['amount'] . '</span>
                                    <a class="quantity-btn" onclick="updateQuantity(' . $item['id'] . ', 1, \'' . $item['table'] . '\')">></a>
                                </div>
                            </div>';
                    }
                }

                $cart_html .= '
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-center my-4 px-2">
                        <div class="d-flex align-items-center mb-3 mb-md-0">
                            <h5>Total: <span id="totalAmount" class="text-success">' . number_format($totalAmount, 0, ',', '.') . '₫</span></h5>
                        </div>
                        <div class="d-flex flex-column flex-md-row align-items-center">
                            <div class="d-flex mb-2 mb-md-0">
                                <form method="post" style="display: inline;">
                                    <button type="submit" name="remove_all" class="btn btn-danger mr-2 mb-2 mb-md-0">Remove All</button>
                                </form>
                                <button class="btn btn-success mb-2 mb-md-0" onclick="showOrderModal()"><b>Order</b></button>
                            </div>
                        </div>
                    </div>';

                echo $cart_html;
            } else {
                echo '<div class="alert alert-danger" style="margin: 6rem 0;">No items found in the cart.</div>';
            }
            ?>
        </main>
    </div>
    <?php include 'web_sections/footer.php'; ?>
</div>

<?php
$stmt = $pdo->prepare("SELECT name, email, address FROM users WHERE user_id = :user_id");
$stmt->execute(['user_id' => $user_id]);
$user = $stmt->fetch(PDO::FETCH_ASSOC) ?: [
    'name' => '',
    'email' => '',
    'address' => '',
];
?>

<div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="orderModalLabel">Place Your Order</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <form id="orderForm" method="POST">
                    <div class="form-group">
                        <label for="name">Full Name</label>
                        <input type="text" class="form-control" id="name" name="name" value="<?= htmlspecialchars($user['name']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($user['email']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="text" class="form-control" id="phone" name="phone" required>
                    </div>
                    <div class="form-group">
                        <label for="address">Shipping Address</label>
                        <textarea class="form-control" id="address" name="address" required><?= htmlspecialchars($user['address']) ?></textarea>
                    </div>

                    <div class="form-group">
                        <label class="radio-inline">
                            <input type="radio" name="payment_method" value="COD" checked onclick="updatePaymentMessage()"> Cash on Delivery (COD)
                        </label>
                        <label class="radio-inline ml-3">
                            <input type="radio" name="payment_method" value="Bank" onclick="updatePaymentMessage()"> Bank Payment
                        </label>
                    </div>

                    <div id="paymentMessage" class="text-secondary mt-2">
                        Pay Upon Delivery
                    </div>
                </form>
            </div>
            <div class="modal-footer d-flex justify-content-between">
                <div class="totalAmount">
                    Total: <span id="totalAmount"><?= number_format($totalAmount, 0, ',', '.') . '₫' ?></span>
                </div>
                <button type="submit" class="btn btn-primary" form="orderForm" name="place_order">Place Order</button>
            </div>
        </div>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="darkmode.js"></script>
<script src="scrolledPosition.js"></script>
<script>
    function updateQuantity(productId, delta, table) {
        const quantityElement = event.target.parentElement.querySelector('span');
        let currentQuantity = parseInt(quantityElement.innerText);
        currentQuantity += delta;

        if (currentQuantity < 1) currentQuantity = 1;

        quantityElement.innerText = currentQuantity;

        $.post('cart.php', {
            update_quantity: true,
            table: table,
            id: productId,
            quantity: currentQuantity
        }, function(response) {
            if (response && response.newTotal) {
                // Update total in the cart
                $('#totalAmount').text(response.newTotal);
                $('#orderModal .totalAmount span').text(response.newTotal);
            }
        }, 'json');
    }

    function updatePaymentMessage() {
        const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
        const paymentMessage = document.getElementById('paymentMessage');

        if (paymentMethod === 'Bank') {
            paymentMessage.classList.remove('text-secondary');
            paymentMessage.textContent = 'Transfer to VCB - 1017110028 - NGUYEN BINH MINH';
            paymentMessage.classList.add('text-success');
        } else {
            paymentMessage.classList.remove('text-success');
            paymentMessage.textContent = 'Pay Upon Delivery';
            paymentMessage.classList.add('text-secondary');
        }
    }

    function showOrderModal() {
        $('#orderModal').modal('show');
    }
</script>
</body>
</html>