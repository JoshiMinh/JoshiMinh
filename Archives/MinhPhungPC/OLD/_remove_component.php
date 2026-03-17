<?php
include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $table = $_POST['table'] ?? null;

    if ($table) {
        if (isset($_SESSION['user_id'])) {
            $userId = $_SESSION['user_id'];
            $stmt = $pdo->prepare("SELECT buildset FROM users WHERE user_id = ?");
            $stmt->execute([$userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result && !empty($result['buildset'])) {
                $buildset = explode(' ', $result['buildset']);
                $buildset = array_filter($buildset, fn($component) => !str_starts_with($component, $table . '-'));
                $updatedBuildset = implode(' ', $buildset);

                $updateStmt = $pdo->prepare("UPDATE users SET buildset = ? WHERE user_id = ?");
                $updateStmt->execute([$updatedBuildset, $userId]);
            }
        } else {
            $buildset = $_COOKIE['buildset'] ?? '';
            $buildsetArray = explode(' ', $buildset);
            $buildsetArray = array_filter($buildsetArray, fn($component) => !str_starts_with($component, $table . '-'));
            setcookie('buildset', implode(' ', $buildsetArray), time() + (86400 * 30), '/');
        }
    }
}

header('Location: index.php');
exit;
?>