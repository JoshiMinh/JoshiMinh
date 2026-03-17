<?php
if (isset($_GET['sort'])) {
    $sortOrder = isset($_GET['sort']) ? $_GET['sort'] : "";
    usort($items, fn($a, $b) => $sortOrder === 'highest' ? $b['price'] - $a['price'] : ($sortOrder === 'cheapest' ? $a['price'] - $b['price'] : 0));
}
?>