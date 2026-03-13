<?php

if (empty($active) || $active !== true) {
    header("Location: index.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_user'])) {
    $pdo->prepare("DELETE FROM users WHERE user_id = ?")->execute([$_POST['user_id']]);
    header("Location: index.php?view=$view&search=$search");
    exit();
}

$view = $_GET['view'] ?? '';
$searchQuery = $_GET['search'] ?? '';
$usersStmt = $pdo->prepare("SELECT * FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY user_id DESC LIMIT 10");
$usersStmt->execute(["%$searchQuery%", "%$searchQuery%"]);

?>

<div class="container text-light">
    <h2 class="my-2">Manage Users</h2>

    <div class="row mt-4">
        <div class="col-12">
            <div class="card bg-dark text-light">
                <div class="card-header">
                    <form method="GET">
                        <input type="hidden" name="view" value="<?= htmlspecialchars($view) ?>">
                        <label for="searchQuery" class="text-light">Search Users: </label>
                        <input type="text" name="search" id="searchQuery" placeholder="Search by name or email" class="form-control" style="width:auto; display:inline-block;" value="<?= htmlspecialchars($searchQuery) ?>">
                        <button type="submit" class="btn btn-primary">Search</button>
                    </form>
                </div>
                <div class="card-body scrollable-card p-0">
                    <table class="table table-dark table-striped text-light" id="userTable">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Name</th>
                                <th>Email</th>
                                <th>Date of Birth</th>
                                <th>Profile Image</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php while ($user = $usersStmt->fetch(PDO::FETCH_ASSOC)): ?>
                                <tr>
                                    <td><?= htmlspecialchars($user['user_id']) ?></td>
                                    <td><?= htmlspecialchars($user['name']) ?></td>
                                    <td><?= htmlspecialchars($user['email']) ?></td>
                                    <td><?= htmlspecialchars($user['date_of_birth']) ?></td>
                                    <td><img src="../<?= htmlspecialchars($user['profile_image']) ?>" alt="Profile Image" width="50"></td>
                                    <td><?= htmlspecialchars($user['address']) ?></td>
                                    <td>
                                        <form method="POST">
                                            <input type="hidden" name="user_id" value="<?= $user['user_id'] ?>">
                                            <button type="submit" name="delete_user" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure you want to delete this user?');">Delete</button>
                                        </form>
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