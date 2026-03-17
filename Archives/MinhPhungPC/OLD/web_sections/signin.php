<?php
require "scripts/send_email.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $verificationCode = rand(100000, 999999);

    if (isset($_POST["signup"])) {
        $username = trim($_POST["username"]);
        $email = trim($_POST["email"]);
        $password = $_POST["password"];
        $retypePassword = $_POST["retype-password"];
        $dob = $_POST["dob"];

        if (
            strlen($password) < 8 ||
            !preg_match("/[A-Za-z]/", $password) ||
            !preg_match("/\d/", $password)
        ) {
            echo '<div class="alert alert-warning">Password must be at least 8 characters long and include both letters and numbers.</div>';
        } elseif ($password !== $retypePassword) {
            echo '<div class="alert alert-warning">Passwords do not match.</div>';
        } else {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $stmt = $pdo->prepare(
                "SELECT user_id FROM users WHERE name = :username OR email = :email",
            );
            $stmt->execute([
                ":username" => $username,
                ":email" => $email,
            ]);

            if ($stmt->rowCount() > 0) {
                echo '<div class="alert alert-warning">User already exists.</div>';
            } else {
                $_SESSION["verification_code"] = $verificationCode;
                $_SESSION["pending_signup"] = [
                    "username" => $username,
                    "email" => $email,
                    "password_hash" => $passwordHash,
                    "dob" => $dob,
                ];

                if (
                    sendEmail(
                        $email,
                        $username,
                        "Your Verification Code",
                        "Your verification code is: $verificationCode",
                    )
                ) {
                    echo '<script>
                            document.addEventListener("DOMContentLoaded", function() {
                                document.getElementById("verificationModal").style.display = "block";
                            });
                          </script>';
                } else {
                    echo '<div class="alert alert-danger">Failed to send verification email.</div>';
                }
            }
        }
    }

    if (isset($_POST["login"])) {
        $loginInput = trim($_POST["login-username-email"]);
        $stmt = $pdo->prepare(
            "SELECT user_id, name, password_hash, profile_image, email FROM users WHERE name = :username OR email = :email",
        );
        $stmt->execute(["username" => $loginInput, "email" => $loginInput]);
        $user = $stmt->fetch();

        if (
            $user &&
            password_verify($_POST["login-password"], $user["password_hash"])
        ) {
            $_SESSION["verification_code"] = $verificationCode;
            $_SESSION["pending_login"] = [
                "user_id" => $user["user_id"],
                "email" => $user["email"],
                "profile_image" => $user["profile_image"],
            ];

            if (
                sendEmail(
                    $user["email"],
                    $user["name"],
                    "Your Verification Code",
                    "Your verification code is: $verificationCode",
                )
            ) {
                echo '<script>
                        document.addEventListener("DOMContentLoaded", function() {
                            document.getElementById("verificationModal").style.display = "block";
                        });
                      </script>';
            } else {
                echo '<div class="alert alert-danger">Failed to send verification email.</div>';
            }
        } else {
            echo '<div class="alert alert-danger">Invalid username or password.</div>';
        }
    }

    if (isset($_POST["verify-code"])) {
        if ($_POST["verification-code"] == $_SESSION["verification_code"]) {
            unset($_SESSION["verification_code"]);
    
            if (isset($_SESSION["pending_signup"])) {
                $pendingSignup = $_SESSION["pending_signup"];
    
                $stmt = $pdo->prepare("INSERT INTO users (name, email, password_hash, date_of_birth) VALUES (:name, :email, :password_hash, :dob)");
                if ($stmt->execute([
                    ":name" => $pendingSignup["username"],
                    ":email" => $pendingSignup["email"],
                    ":password_hash" => $pendingSignup["password_hash"],
                    ":dob" => $pendingSignup["dob"],
                ])) {
                    $_SESSION["user_id"] = $pdo->lastInsertId();
                    $_SESSION["email"] = $pendingSignup["email"];
                    $_SESSION['profile_image'] = 'default.jpg';
    
                    echo '<div class="alert alert-success">Registration successful! You are now logged in.</div>';
                    unset($_SESSION["pending_signup"]);
                    echo "<script>window.location.href = window.location.href;</script>";
                    exit();
                } else {
                    echo '<div class="alert alert-danger">Registration failed. Please try again.</div>';
                }
            }
    
            if (isset($_SESSION["pending_login"])) {
                $_SESSION = array_merge($_SESSION, $_SESSION["pending_login"]);
                unset($_SESSION["pending_login"]);
                echo "<script>window.location.href = window.location.href;</script>";
                exit();
            }
        } else {
            echo '<div class="alert alert-danger">Invalid verification code.</div>';
        }
    }    
}
?>

<div class="row justify-content-center">
    <div class="col-md-5 col-sm-10">
        <h2>Sign Up</h2>
        <form method="POST">
            <div class="form-group">
                <label for="signup-username">Username</label>
                <input type="text" class="form-control" id="signup-username" name="username" placeholder="Enter username" required>
            </div>
            <div class="form-group">
                <label for="signup-email">Email address</label>
                <input type="email" class="form-control" id="signup-email" name="email" placeholder="Enter email" required>
            </div>
            <div class="form-group">
                <label for="signup-password">Password</label>
                <input type="password" class="form-control" id="signup-password" name="password" placeholder="Password" required>
            </div>
            <div class="form-group">
                <label for="signup-retype-password">Retype Password</label>
                <input type="password" class="form-control" id="signup-retype-password" name="retype-password" placeholder="Retype password" required>
            </div>
            <div class="form-group">
                <label for="signup-dob">Date of Birth</label>
                <input type="date" class="form-control" id="signup-dob" name="dob" required>
            </div>
            <button type="submit" name="signup" class="btn btn-primary w-100">Sign Up</button>
        </form>
    </div>

    <div class="col-md-1 d-none d-md-flex align-items-center justify-content-center">
        <div class="border-end h-100"></div>
    </div>

    <div class="col-md-5 col-sm-10 mt-4 mt-md-0">
        <h2 class="mt-2 mt-md-0">Login</h2>
        <form method="POST">
            <div class="form-group">
                <label for="login-username-email">Username/Email</label>
                <input type="text" class="form-control" id="login-username-email" name="login-username-email" placeholder="Enter username or email" required>
            </div>
            <div class="form-group">
                <label for="login-password">Password</label>
                <input type="password" class="form-control" id="login-password" name="login-password" placeholder="Password" required>
            </div>
            <button type="submit" name="login" class="btn btn-primary w-100">Login</button>
            <div class="text-left mt-2">
                <a href="forgot.php">Forgot Password?</a>
            </div>
        </form>
    </div>
</div>

<div class="modal" id="verificationModal" tabindex="-1" style="display: none;">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Enter Email Verification Code</h5>
                <button type="button" onclick="document.getElementById('verificationModal').style.display = 'none'" aria-label="Close">&times;</button>
            </div>
            <div class="modal-body">
                <form method="POST">
                    <input type="hidden" name="verify-code" value="1">
                    <div class="form-group">
                        <label for="verification-code">Verification Code</label>
                        <input type="text" class="form-control" id="verification-code" name="verification-code" placeholder="Enter 6-digit code" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 mt-3">Verify</button>
                </form>
            </div>
        </div>
    </div>
</div>