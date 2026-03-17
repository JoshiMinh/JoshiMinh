<?php

return [
    'processor' => ['id', 'name', 'brand', 'price', 'image', 'core_count', 'thread_count', 'socket_type', 'tdp'],
    'motherboard' => ['id', 'name', 'brand', 'price', 'image', 'socket_type', 'chipset', 'memory_slots', 'max_memory_capacity', 'ddr', 'expansion_slots'],
    'memory' => ['id', 'name', 'brand', 'price', 'image', 'ddr', 'capacity', 'speed'],
    'graphicscard' => ['id', 'name', 'brand', 'price', 'image', 'vram_capacity', 'cuda_cores', 'tdp'],
    'storage' => ['id', 'name', 'brand', 'price', 'image', 'type', 'capacity', 'speed', 'port'],
    'cpucooler' => ['id', 'name', 'brand', 'price', 'image', 'cooling_type', 'socket'],
    'powersupply' => ['id', 'name', 'brand', 'price', 'image', 'wattage', 'efficiency_rating'],
    'pccase' => ['id', 'name', 'brand', 'price', 'image', 'size'],
    'operatingsystem' => ['id', 'name', 'brand', 'price', 'image', 'version'],
];
