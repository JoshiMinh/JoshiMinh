<?php
include 'db.php';

if (isset($_POST['component_id'], $_POST['table_name'])) {
    $component_id = $_POST['component_id'];
    $table_name = $_POST['table_name'];
    $totalAmount = 0;

    if (isset($_SESSION['user_id'])) {
        $user_id = $_SESSION['user_id'];
        $stmt = $pdo->prepare("SELECT buildset FROM users WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $buildset = $stmt->fetchColumn();

        $updatedComponents = $buildset ? array_filter(explode(' ', $buildset), fn($item) => strpos($item, "$table_name-") === false) : [];
        $updatedComponents[] = "$table_name-$component_id";
        $updatedComponents = array_unique($updatedComponents);
        $updatedBuildset = implode(' ', $updatedComponents);

        $stmt = $pdo->prepare("UPDATE users SET buildset = ? WHERE user_id = ?");
        $stmt->execute([$updatedBuildset, $user_id]);

        foreach ($updatedComponents as $component) {
            list($compTable, $compId) = explode('-', $component);
            $priceStmt = $pdo->prepare("SELECT price FROM $compTable WHERE id = ?");
            $priceStmt->execute([$compId]);
            $totalAmount += $priceStmt->fetchColumn() ?: 0;
        }

        echo json_encode(['status' => 'success', 'message' => 'Buildset updated successfully.', 'totalAmount' => $totalAmount]);
    } else {
        $buildset = $_COOKIE['buildset'] ?? '';
        $updatedComponents = $buildset ? array_filter(explode(' ', $buildset), fn($item) => strpos($item, "$table_name-") === false) : [];
        $updatedComponents[] = "$table_name-$component_id";
        $updatedComponents = array_unique($updatedComponents);
        $updatedBuildset = implode(' ', $updatedComponents);

        setcookie('buildset', $updatedBuildset, time() + 3600 * 24 * 30, '/');

        foreach ($updatedComponents as $component) {
            list($compTable, $compId) = explode('-', $component);
            $priceStmt = $pdo->prepare("SELECT price FROM $compTable WHERE id = ?");
            $priceStmt->execute([$compId]);
            $totalAmount += $priceStmt->fetchColumn() ?: 0;
        }

        echo json_encode(['status' => 'success', 'message' => 'Buildset updated in cookie.', 'totalAmount' => $totalAmount]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Missing required data.']);
}
?>