<?php
include 'db.php';

if (isset($_SESSION['user_id'])) {
    header("Location: account.php");
    exit();
}

if (isset($_POST['verify_code'])) {
    $enteredCode = $_POST['verify_code'];
    $sessionCode = $_SESSION['verification_code'];

    if ($enteredCode == $sessionCode) {
        $_SESSION['verified'] = true;
    } else {
        $_SESSION['verified'] = false;
        echo "<script>alert('Invalid verification code. Please try again.');</script>";
    }
}

if (isset($_POST['go_back'])) {
    $_SESSION['verified'] = false;
    header("Location: " . $_SERVER['PHP_SELF']);
    exit();
}

if (isset($_POST['new_password']) && isset($_SESSION['email'])) {
    $newPassword = $_POST['new_password'];
    $reEnteredPassword = $_POST['re_enter_password'];
    $email = $_SESSION['email'];

    $stmt = $pdo->prepare("SELECT password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (password_verify($newPassword, $user['password_hash'])) {
        echo "<script>alert('New password cannot be the same as the old one.');</script>";
    } elseif ($newPassword != $reEnteredPassword) {
        echo "<script>alert('Passwords do not match. Please try again.');</script>";
    } elseif (!preg_match('/[A-Za-z]/', $newPassword) || !preg_match('/\d/', $newPassword) || strlen($newPassword) < 8) {
        echo "<script>alert('Password must be at least 8 characters long and include both text and numbers.');</script>";
    } else {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $stmt = $pdo->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
        $stmt->execute([$hashedPassword, $email]);

        echo "<script>alert('Password successfully changed.');</script>";
        
        $stmt = $pdo->prepare("SELECT user_id, profile_image FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        $_SESSION["user_id"] = $user['user_id'];
        $_SESSION["email"] = $email;
        $_SESSION['profile_image'] = $user['profile_image'];
        $_SESSION['verified'] = false;

        header("Location: account.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password</title>
    <link rel="icon" href="icon.png" type="image/png">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
<div class="wrapper">
    <div class="content">
        <?php include 'web_sections/navbar.php'; ?>
        <main class="container">
            <div class="d-flex flex-column align-items-center w-100 my-5" style="min-height: 80vh;">
                <?php if (!isset($_SESSION['verified']) || $_SESSION['verified'] == false): ?>
                    <div class="card p-4" style="width: 100%; max-width: 400px; margin-bottom: 1.5rem;">
                        <h5 class="card-title text-center">Forgot Password</h5>
                        <form id="forgotPasswordForm" method="POST">
                            <div class="form-group">
                                <label for="email">Enter Your Email</label>
                                <input type="email" class="form-control" id="email" name="email" placeholder="Enter your email" required>
                            </div>
                            <button type="button" id="sendOtpBtn" class="btn btn-secondary btn-block">Send OTP</button>
                            <div class="form-group mt-3">
                                <label for="verification-code">Enter Verification Code</label>
                                <input type="text" class="form-control" id="verification-code" name="verify_code" placeholder="Enter verification code" disabled required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Submit</button>
                        </form>
                    </div>
                <?php else: ?>
                    <div class="card p-4" style="width: 100%; max-width: 400px; margin-bottom: 1.5rem;">
                        <h5 class="card-title text-center">Reset Password</h5>
                        <form method="POST">
                            <div class="form-group">
                                <label for="new-password">Enter New Password</label>
                                <input type="password" class="form-control" id="new-password" name="new_password" placeholder="Enter new password" required>
                            </div>
                            <div class="form-group">
                                <label for="re-enter-password">Re-enter New Password</label>
                                <input type="password" class="form-control" id="re-enter-password" name="re_enter_password" placeholder="Re-enter new password" required>
                            </div>
                            <button type="submit" class="btn btn-primary btn-block">Submit</button>
                        </form>
                    </div>
                    <form method="POST" style="max-width: 400px; display: flex; justify-content: flex-start; width: 100%;">
                        <button type="submit" name="go_back" class="btn btn-secondary">
                            <i class="fas fa-arrow-left"></i> Back
                        </button>
                    </form>
                <?php endif; ?>
            </div>
        </main>
        <?php include 'web_sections/footer.php'; ?>
    </div>
</div>

<script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="darkmode.js"></script>
<script>
    $(document).ready(function() {
        $('#sendOtpBtn').click(function() {
            var email = $('#email').val();
            if (email) {
                $(this).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...').prop('disabled', true);
                $.ajax({
                    url: '_emailForgot.php',
                    type: 'POST',
                    data: { email: email },
                    success: function(response) {
                        if (response === 'email_exists') {
                            alert('OTP sent!');
                            $('#verification-code').prop('disabled', false);
                            $('#email').prop('disabled', true);
                        } else {
                            alert('Email does not exist.');
                        }
                    },
                    error: function() {
                        alert('Something went wrong. Please try again.');
                    },
                    complete: function() {
                        $('#sendOtpBtn').html('Send OTP').prop('disabled', false);
                    }
                });
            } else {
                alert('Please enter a valid email address.');
            }
        });
    });
</script>
</body>
</html>