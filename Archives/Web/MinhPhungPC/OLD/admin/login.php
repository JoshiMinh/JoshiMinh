<?php
include 'db_conn.php';
session_start();

if (isset($_SESSION['minhphungpc_admin_id'])) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT admin_id, password_hash FROM admin WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();

    if ($stmt->rowCount()) {
        $user = $stmt->fetch();
        if (password_verify($password, $user['password_hash'])) {
            $_SESSION['minhphungpc_admin_id'] = $user['admin_id'];
            header("Location: index.php");
            exit();
        }
        echo "<script>alert('Incorrect password.');</script>";
    } else {
        echo "<script>alert('Username not found.');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
    <title>Login to Admin</title>
    <link rel="icon" type="image/png" href="../icon.png">
    <link rel="stylesheet" href="styles.css">
    <style>
        body { background: linear-gradient(-45deg, #6a11cb, #2575fc); }
        .card { background-color: var(--bg-primary); width: 100%; max-width: 400px; color: white; }
        .enter-btn { background: linear-gradient(-45deg, #6a11cb, #2575fc); border: none; }
    </style>
</head>
<body class="text-light bg-dark">
    <div class="container d-flex justify-content-center align-items-center vh-100">
        <div class="card p-4 text-light">
            <h3 class="card-title text-center mb-3">Admin Login</h3>
            <form method="POST">
                <div class="form-group mt-2">
                    <label>Username</label>
                    <input type="text" name="username" class="form-control p_input mt-1" required>
                </div>
                <div class="form-group mt-2">
                    <label>Password</label>
                    <input type="password" name="password" class="form-control p_input mt-1" required>
                </div>
                <div class="text-center d-grid gap-2 mt-3">
                    <button type="submit" class="btn btn-primary btn-block enter-btn">Login</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>