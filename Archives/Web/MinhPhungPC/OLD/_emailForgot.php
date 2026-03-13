<?php
include 'db.php';
require 'scripts/send_email.php';

if (isset($_POST['email'])) {
    $email = $_POST['email'];
    $_SESSION["email"] = $email;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);

    if ($stmt->rowCount() > 0) {
        $verificationCode = rand(100000, 999999);
        $_SESSION['verification_code'] = $verificationCode;

        $subject = "Your Verification Code";
        $body = "Your Verification Code to Reset Password is: <strong>$verificationCode</strong>";
        $altBody = "Your Verification Code to Reset Password is: $verificationCode";

        $user = $stmt->fetch();
        sendEmail($email, $user['name'], $subject, $body, $altBody);

        echo 'email_exists';
    } else {
        echo 'email_not_found';
    }
}
?>