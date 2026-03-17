<?php
include 'db_conn.php';
session_start();

if (!isset($_SESSION['minhphungpc_admin_id'])) {
    header('Location: login.php');
    exit();
}

$admin_id = $_SESSION['minhphungpc_admin_id'];
$view = $_GET['view'] ?? '';
$validViews = ['dashboard', 'manage_products', 'manage_users', 'add_or_edit_product'];
$active = true;

$stmt = $pdo->prepare("SELECT username FROM admin WHERE admin_id = ?");
$stmt->bindParam(1, $admin_id, PDO::PARAM_INT);
$stmt->execute();
$username = $stmt->fetchColumn() ?: '';

if (isset($_POST['logout'])) {
    session_unset();
    session_destroy();
    header('Location: login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/png" href="../icon.png">
    <style>
        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
        }
        .sidebar {
            background: linear-gradient(-60deg, var(--primary-color), var(--secondary-color));
            min-width: 200px;
            max-width: 250px;
        }
        .sidebar .nav-link {
            color: var(--text-primary);
        }
        .sidebar .nav-link.active, .sidebar .nav-link:hover {
            background-color: rgba(255, 255, 255, 0.4);
        }
        .sidebar .nav {
            list-style-type: none;
            padding-left: 0;
        }
        .sidebar .nav-item {
            width: 100%;
        }
        @media (min-width: 768px) {
            .offcanvas-md {
                visibility: visible !important;
                transform: none !important;
                position: relative !important;
            }
        }
        header.navbar {
            background-color: var(--bg-secondary);
            color: var(--text-primary);
        }
        .sidebar-header {
            text-align: center;
            padding: 1rem;
        }
        .centered-404 {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        .card {
            border: none;
        }
        .card-header {
            background-color: var(--bg-secondary);
        }
        .card-body {
            background-color: var(--bg-elevated);
        }
        .scrollable-card {
            height: 500px;
            overflow-y: auto;
        }
    </style>
</head>
<body>
    <div class="d-flex flex-column vh-100">
        <div class="d-flex flex-grow-1 overflow-hidden">
            <aside class="offcanvas-md offcanvas-start d-md-flex flex-column sidebar" id="sidebar">
                <div class="sidebar-header">
                    <a href="index.php">
                        <img src="../logo_light.png" alt="Logo" class="img-fluid" style="width: 80%;">
                    </a>
                </div>
                <div class="flex-grow-1">
                    <ul class="nav flex-column p-2">
                        <li class="nav-item"><a class="nav-link" href="index.php?view=dashboard">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="index.php?view=manage_products">Manage Products</a></li>
                        <li class="nav-item"><a class="nav-link" href="index.php?view=manage_users">Manage Users</a></li>
                    </ul>
                </div>
                <div class="mt-auto p-2 text-center">
                    <div class="d-flex align-items-center justify-content-center mb-1">
                        <span class="text-light"><?= htmlspecialchars($username) ?></span>
                        <span class="mx-2">•</span>
                        <form method="POST" class="m-0">
                            <button type="submit" name="logout" class="btn btn-link text-danger p-0">Log Out</button>
                        </form>
                    </div>
                </div>
            </aside>
            <main class="flex-grow-1 p-3 overflow-auto">
                <button class="btn btn-outline-primary d-md-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-controls="sidebar">&#9776;</button>
                <div>
                    <?php if ($view === ''): 
                        include 'dashboard.php'; 
                    elseif (!in_array($view, $validViews)): ?>
                        <div class="centered-404"><h3>404 Page Not Found</h3></div>
                    <?php else: 
                        include $view . '.php'; 
                    endif; ?>
                </div>
            </main>
        </div>
    </div>
    <script src="../scrolledPosition.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>