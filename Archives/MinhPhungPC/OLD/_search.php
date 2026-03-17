<?php
include 'db.php';
include 'scripts/tableColumns.php';

try {
    $search = '%' . $_GET['search'] . '%';
    $tables = array_keys($components);
    $components = [];

    if ($search) {
        foreach ($tables as $table) {
            $stmt = $pdo->prepare("SELECT *, :table AS item_table FROM $table WHERE name LIKE :query OR brand LIKE :query");
            $stmt->execute(['query' => $search, 'table' => $table]);
            $components = array_merge($components, $stmt->fetchAll(PDO::FETCH_ASSOC));
        }
    }

    echo json_encode($components);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Error fetching components: " . $e->getMessage()]);
}
?>