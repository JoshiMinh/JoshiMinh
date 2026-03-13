<?php
$userId = $_SESSION['user_id'] ?? 0;

$stmt = $pdo->prepare("SELECT name, email, date_of_birth, profile_image, address, password_hash FROM users WHERE user_id = :user_id");
$stmt->execute(['user_id' => $userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC) ?: [
    'name' => '',
    'email' => '',
    'date_of_birth' => '',
    'profile_image' => 'default.jpg',
    'address' => '',
    'password_hash' => ''
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['save-changes'])) {
        $newUsername = $_POST['username'] ?? '';

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE name = :name AND user_id != :user_id");
        $stmt->execute(['name' => $newUsername, 'user_id' => $userId]);
        $usernameExists = $stmt->fetchColumn();

        if ($usernameExists) {
            echo '<div class="alert alert-warning" style="margin-top: 4rem; margin-bottom: 4rem;">Username already exists. Please choose a different one.</div>';
        } else {
            $uploadDir = 'profile_images/';
            $oldProfileImage = $user['profile_image'];

            if (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
                if ($oldProfileImage != 'default.jpg' && file_exists($oldProfileImage)) {
                    unlink($oldProfileImage);
                }

                $fileExtension = pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION);
                $newFileName = $newUsername . '.' . $fileExtension;

                if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $uploadDir . $newFileName)) {
                    $profileImagePath = $uploadDir . $newFileName;
                    $stmt = $pdo->prepare("UPDATE users SET name = :name, date_of_birth = :dob, address = :address, profile_image = :profile_image WHERE user_id = :user_id");
                    $stmt->execute([
                        'name' => $newUsername,
                        'dob' => $_POST['dob'] ?? $user['date_of_birth'],
                        'address' => $_POST['address'] ?? $user['address'],
                        'profile_image' => $profileImagePath,
                        'user_id' => $userId
                    ]);
                    $_SESSION['profile_image'] = $profileImagePath;
                } else {
                    echo "Error uploading file.";
                }
            } else {
                $stmt = $pdo->prepare("UPDATE users SET name = :name, date_of_birth = :dob, address = :address WHERE user_id = :user_id");
                $stmt->execute([
                    'name' => $newUsername,
                    'dob' => $_POST['dob'] ?? $user['date_of_birth'],
                    'address' => $_POST['address'] ?? $user['address'],
                    'user_id' => $userId
                ]);
            }
            
            echo "<script>window.location.href = window.location.href;</script>";
            exit();
        }
    }

    if (isset($_POST['change-password'])) {
        $currentPassword = $_POST['current-password'] ?? '';
        $newPassword = $_POST['new-password'] ?? '';
        $retypePassword = $_POST['retype-password'] ?? '';

        if (strlen($newPassword) < 8 || !preg_match('/[A-Za-z]/', $newPassword) || !preg_match('/[0-9]/', $newPassword)) {
            echo '<div class="alert alert-warning">New password must be at least 8 characters long and include both letters and numbers.</div>';
        } elseif ($newPassword !== $retypePassword) {
            echo '<div class="alert alert-warning">New passwords do not match. Please try again.</div>';
        } else {
            $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE user_id = :user_id");
            $stmt->execute(['user_id' => $userId]);
            $storedPasswordHash = $stmt->fetchColumn();

            if (password_verify($currentPassword, $storedPasswordHash)) {
                $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
                $stmt = $pdo->prepare("UPDATE users SET password_hash = :password WHERE user_id = :user_id");
                $stmt->execute(['password' => $newPasswordHash, 'user_id' => $userId]);

                echo '<div class="alert alert-success">Password changed successfully!</div>';
            } else {
                echo '<div class="alert alert-warning">Current password is incorrect.</div>';
            }
        }
    }

    if (isset($_POST['logout'])) {
        session_unset();
        session_destroy();
        echo "<script>window.location.href = window.location.href;</script>";
        exit();
    }
}
?>

<div class="container">
    <div class="text-center mb-4">
        <img src="<?= htmlspecialchars($user['profile_image']); ?>" alt="Profile Image" class="rounded-circle" style="width: 150px; height: 150px;">
    </div>
    <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
            <a class="nav-link active" id="profile-tab" data-bs-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="true">Profile</a>
        </li>
        <li class="nav-item" role="presentation">
            <a class="nav-link" id="order-history-tab" data-bs-toggle="tab" href="#order-history" role="tab" aria-controls="order-history" aria-selected="false">Order History</a>
        </li>
    </ul>

    <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active mt-2" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <form action="" method="POST" enctype="multipart/form-data">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" class="form-control" id="username" name="username" value="<?= htmlspecialchars($user['name']); ?>" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" class="form-control" id="email" name="email" value="<?= htmlspecialchars($user['email']); ?>" readonly style="background: var(--bg-elevated); color: var(--text-primary);">
                </div>
                <div class="form-group">
                    <label for="dob">Date of Birth</label>
                    <input type="date" class="form-control" id="dob" name="dob" value="<?= htmlspecialchars($user['date_of_birth']); ?>">
                </div>
                <div class="form-group">
                    <label for="address">Address</label>
                    <input type="text" class="form-control" id="address" name="address" value="<?= htmlspecialchars($user['address']); ?>">
                </div>
                <div class="form-group">
                    <label for="profile-image">Select an image (JPG, PNG)</label>
                    <input type="file" class="form-control-file" id="profile-image" name="profile_image" accept=".jpg, .jpeg, .png">
                </div>
                <button type="submit" class="btn btn-primary btn-block" name="save-changes">Save Changes</button>
            </form>

            <h5 class="mt-4">Change Password</h5>
            <form action="" method="POST">
                <div class="form-group">
                    <label for="current-password">Current Password</label>
                    <input type="password" class="form-control" id="current-password" name="current-password" placeholder="Enter current password">
                </div>
                <div class="form-group">
                    <label for="new-password">New Password</label>
                    <input type="password" class="form-control" id="new-password" name="new-password" placeholder="Enter new password">
                </div>
                <div class="form-group">
                    <label for="retype-password">Retype New Password</label>
                    <input type="password" class="form-control" id="retype-password" name="retype-password" placeholder="Retype new password">
                </div>
                <button type="submit" class="btn btn-warning btn-block" name="change-password" onclick="setPasswordRequired()">Change Password</button>
            </form>

            <div class="d-flex justify-content-between mt-3">
                <form action="" method="POST" style="flex: 1; margin-right: 5px;">
                    <button type="submit" class="btn btn-danger btn-block" name="logout">Sign Out</button>
                </form>
            </div>
        </div>

        <div class="tab-pane fade" id="order-history" role="tabpanel" aria-labelledby="order-history-tab">
            <?php include 'web_sections/order_history.php'; ?>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js"></script>
<script>
function setPasswordRequired() {
    document.getElementById('current-password').setAttribute('required', 'required');
    document.getElementById('new-password').setAttribute('required', 'required');
    document.getElementById('retype-password').setAttribute('required', 'required');
}
</script>