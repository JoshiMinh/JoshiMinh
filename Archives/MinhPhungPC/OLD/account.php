<?php 
include 'db.php'; 

$username = 'Log in / Sign up';
if (isset($_SESSION['user_id'])) {
    $userId = $_SESSION['user_id'];
    $stmt = $pdo->prepare("SELECT name FROM users WHERE user_id = :user_id");
    $stmt->execute(['user_id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    $username = htmlspecialchars($user['name'] ?? 'User');
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $username ?></title>
    <link rel="icon" href="icon.png" type="image/png">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
    <style>
        a:hover{
            text-decoration: none;
        }
    </style>
</head>
<body>

<div class="wrapper">
    <div class="content">
        <?php include 'web_sections/navbar.php'; ?>
        <main class="container my-4">
            <?php include isset($_SESSION['user_id']) ? 'web_sections/logged.php' : 'web_sections/signin.php'; ?>
        </main>
    </div>
    <?php include 'web_sections/footer.php'; ?>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="darkmode.js"></script>
</body>
</html>