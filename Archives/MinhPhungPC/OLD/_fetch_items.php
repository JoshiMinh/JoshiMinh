<?php

include "db.php";

if (isset($_GET["table"])) {
    $query = "SELECT id, name, brand, image, price FROM `{$_GET["table"]}`";

    if (isset($_SESSION["user_id"])) {
        $user_id = $_SESSION["user_id"];
        $stmt = $pdo->prepare("SELECT buildset FROM users WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $buildset = $stmt->fetchColumn();
    } else {
        $buildset = $_COOKIE["buildset"] ?? "";
    }

    if (empty($buildset)) {
        $stmt = $pdo->prepare($query);
        $stmt->execute();
        $components = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            "items" => $components,
            "count" => count($components),
        ]);
        exit();
    }

    $buildset_parts = explode(" ", $buildset);
    $buildset_array = [];
    foreach ($buildset_parts as $part) {
        list($key, $value) = explode("-", $part);
        $buildset_array[$key] = $value;
    }

    $where_clause = [];
    $params = [];

    if (
        $_GET["table"] == "processor" &&
        isset($buildset_array["motherboard"])
    ) {
        $motherboard_id = (int) $buildset_array["motherboard"];
        $where_clause[] =
            "socket_type = (SELECT socket_type FROM motherboard WHERE id = ?)";
        $params[] = $motherboard_id;
    } elseif (
        $_GET["table"] == "memory" &&
        isset($buildset_array["motherboard"])
    ) {
        $motherboard_id = (int) $buildset_array["motherboard"];
        $where_clause[] = "ddr = (SELECT ddr FROM motherboard WHERE id = ?)";
        $params[] = $motherboard_id;
    } elseif ($_GET["table"] == "motherboard") {
        if (isset($buildset_array["memory"])) {
            $memory_id = (int) $buildset_array["memory"];
            $where_clause[] = "ddr = (SELECT ddr FROM memory WHERE id = ?)";
            $params[] = $memory_id;
        }
        if (isset($buildset_array["processor"])) {
            $processor_id = (int) $buildset_array["processor"];
            $where_clause[] =
                "socket_type = (SELECT socket_type FROM processor WHERE id = ?)";
            $params[] = $processor_id;
        }
    }

    if (!empty($where_clause)) {
        $query .= " WHERE " . implode(" AND ", $where_clause);
    }

    try {
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $components = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            "items" => $components,
            "count" => count($components),
        ]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error"]);
    }
} else {
    echo json_encode(["items" => [], "count" => 0]);
}

?>