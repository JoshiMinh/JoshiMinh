-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 08, 2025 at 05:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pcbuilding`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `username`, `password_hash`) VALUES
(1, 'admin', '$2y$10$zWzE08bcg2TJwE2.Tva96eN3u.z.y8w79vFts5AT61okfVEz01I3i');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `product_id` varchar(255) DEFAULT NULL,
  `product_table` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `user_id`, `product_id`, `product_table`, `content`, `time`) VALUES
(34, '25', '8', 'motherboard', 'sản phẩm 10đ', '2024-12-24 20:57:59'),
(35, '29', '10', 'memory', '10 điểm', '2024-12-25 14:12:02'),
(36, '29', '5', 'memory', 'hello', '2025-03-08 11:44:42'),
(37, '29', '7', 'memory', 'hello', '2025-03-08 11:48:49');

-- --------------------------------------------------------

--
-- Table structure for table `cpucooler`
--

CREATE TABLE `cpucooler` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `brand` varchar(20) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `cooling_type` text DEFAULT NULL,
  `socket` text DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cpucooler`
--

INSERT INTO `cpucooler` (`id`, `name`, `brand`, `price`, `image`, `cooling_type`, `socket`, `ratings`) VALUES
(1, ' Fan CPU Noctua NH-D15', 'Noctua ', 3059000, 'https://hanoicomputercdn.com/media/product/47785_fan_cpu_noctua_nh_d15_0000_1__1_.jpg', 'air', 'LGA1851, LGA1700, LGA1200, LGA1156, LGA1155, LGA1151, LGA1150 ,AM5, AM4', NULL),
(2, 'Fan CPU Intel Socket 1700', 'Intel', 199000, 'https://hanoicomputercdn.com/media/product/77612_stock_1700.jpg', 'air', 'LGA1700', NULL),
(3, 'Fan CPU DEEPCOOL AK620', 'DEEPCOOL ', 1699000, 'https://hanoicomputercdn.com/media/product/64849_dc_ak620__4_.jpg', 'air', 'LGA1700', ' 29-2'),
(4, 'Fan CPU Coolermaster Hyper 212 Spectrum V3', 'Coolermaster', 389000, 'https://hanoicomputercdn.com/media/product/72283_212_v3__3_.jpg', 'air', 'LGA1700, AM5', ' 29-5'),
(5, 'FAN ID-Cooling CPU SE-226 - XT ARGB', 'ID-Cooling', 899000, 'https://hanoicomputercdn.com/media/product/64797_se_226_xt_argb__3_.jpg', 'air', 'LGA1700, LGA1200, LGA2066, LGA2011, LGA1151, LGA1150, LGA1155, LGA1156, AM4', NULL),
(6, 'ASUS ROG Ryujin III 360 ARGB Extreme', 'ASUS ', 10989000, 'https://hanoicomputercdn.com/media/product/87602_tan_nhiet_nuoc_asus_rog_ryujin_iii_360_argb_extremex__5_.jpg', 'water', 'LGA 1851, LGA1700, LGA1200, LGA115x, AM5,AM4', NULL),
(7, 'Corsair NAUTILUS 360 ARGB', 'Corsair', 2699000, 'https://hanoicomputercdn.com/media/product/87100_tan_nhiet_nuoc_corsair_nautilus_360_argb_black__3_.jpg', 'water', 'Intel 1700, AM5, AM4', NULL),
(8, 'DEEPCOOL MYSTIQUE 360 WH', 'DEEPCOOL', 3989000, 'https://hanoicomputercdn.com/media/product/86924_tan_nhiet_nuoc_deepcool_mystique_360_wh_white__5_.jpg', 'water', 'LGA1700, LGA1200, LGA1151, LGA1150, LGA1155, AM5,AM4', NULL),
(9, 'AIO MSI MAG CORELIQUID M360', 'MSI', 2249000, 'https://hanoicomputercdn.com/media/product/81756_t___n_nhi___t_n_____c_aio_msi_mag_coreliquid_m360_1.jpg', 'water', ' LGA 1150, 1151, 1155, 1156, LGA1200, 1700, LGA2011, LGA2011-3, LGA2066, AM5, AM4', NULL),
(10, 'Xigmatek FENIX 240', 'Xigmatek', 1099000, 'https://hanoicomputercdn.com/media/product/83018_tan_nhiet_nuoc_xigmatek_fenix_240__3_.jpg', 'water', 'LGA1700, LGA1200, LGA115x,  AM5, AM4', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `graphicscard`
--

CREATE TABLE `graphicscard` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `brand` varchar(20) DEFAULT NULL,
  `vram_capacity` int(11) DEFAULT NULL,
  `cuda_cores` int(11) DEFAULT NULL,
  `TDP` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graphicscard`
--

INSERT INTO `graphicscard` (`id`, `name`, `brand`, `vram_capacity`, `cuda_cores`, `TDP`, `price`, `image`, `ratings`) VALUES
(1, 'ASUS ROG STRIX RTX 4090 OC GAMING', 'ASUS', 24, 16384, 450, 61999000, 'https://www.tncstore.vn/media/product/250-7544-asus-rog-strix-rtx-4090-oc-24gb-gaming.jpg', ' 29-4 25-5'),
(2, 'ASUS TUF RTX 4080 GAMING OC', 'ASUS', 16, 9728, 320, 36990000, 'https://www.tncstore.vn/media/product/250-8899-asus-tuf-rtx-4080-o16g-gaming-1.jpg', ' 29-4'),
(3, 'MSI GAMING X TRIO RTX 4070 Ti', 'MSI', 12, 7680, 285, 23990000, 'https://www.tncstore.vn/media/product/250-7949-msi-rtx-4070-ti-gaming-x-trio-12gb.png', NULL),
(4, 'GIGABYTE GAMING OC RTX 4070', 'GIGABYTE', 12, 5888, 200, 27990000, 'https://www.tncstore.vn/media/product/250-8076-rtx-4070-ti-gaming-oc-12g.jpg', NULL),
(5, 'ASUS DUAL RTX 3060 Ti O8G V2', 'ASUS', 8, 4864, 200, 9690000, 'https://www.tncstore.vn/media/product/250-5676-card-man-hinh-asus-dual-geforce-rtx3060-ti-v2-oc-edition-1.jpg', NULL),
(6, 'MSI GAMING X RTX 4060 Ti', 'MSI', 8, 4352, 160, 14290000, 'https://www.tncstore.vn/media/product/250-8658-1.png', NULL),
(7, 'ASUS TUF RX 7900 XTX GAMING OC', 'ASUS', 24, 12288, 355, 35399000, 'https://hanoicomputercdn.com/media/product/70168_card_man_hinh_asus_tuf_gaming_rx_7900_xtx_oc_oc_edition_24gb_gddr6__4_.jpg', NULL),
(8, 'GIGABYTE GAMING OC RX 7800 XT', 'GIGABYTE', 16, 3840, 263, 17999000, 'https://hanoicomputercdn.com/media/product/78867__card_man_hinh_gigabyte_rx_7800_xt_gaming_oc_16gb__2_.jpg', NULL),
(10, 'ASUS DUAL RX 6600 O8G', 'ASUS', 8, 1792, 132, 15299000, 'https://www.tncstore.vn/media/product/250-5671-card-man-hinh-asus-dual-redeon-rx-6600-xt-oc-edition-1.jpg', NULL),
(11, 'MSI MECH 2X RX 6500 XT', 'MSI', 4, 1024, 107, 4599000, 'https://www.tncstore.vn/media/product/250-6211-card-man-hinh-msi-radeon-rx-6500-xt-mech-2x-4g-oc-1.jpg', NULL),
(12, 'GIGABYTE RX 6400 EAGLE', 'GIGABYTE', 4, 768, 53, 2699000, 'https://anphat.com.vn/media/product/41787_vga_gigabyte_rx_6400_eagle_4gb_gddr6__gv_r64eagle_4gd___4_.png', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `memory`
--

CREATE TABLE `memory` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `brand` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `image` text DEFAULT NULL,
  `ddr` int(11) DEFAULT NULL,
  `capacity` varchar(255) DEFAULT NULL,
  `speed` varchar(255) DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `memory`
--

INSERT INTO `memory` (`id`, `name`, `brand`, `price`, `image`, `ddr`, `capacity`, `speed`, `ratings`) VALUES
(1, 'Ram Desktop Kingston Fury Beast RGB (KF432C16BB2A/32)', 'Kingston', 2199000, 'https://hanoicomputercdn.com/media/product/80575_2ram_desktop_kingston_fury_beast_rgb_kf432c16bb2a_32_32gb_1x32gb_ddr4_3200mhz__6_.jpg', 4, '32', '3200', NULL),
(2, 'RAM Desktop TEAMGROUP DELTA RGB (TF3D416G3200HC16F01)', 'TEAMGROUP', 1029000, 'https://hanoicomputercdn.com/media/product/65727_ram_desktop_teamgroup_delta_rgb_tf3d416g3200hc16f01_16gb_1x16gb_ddr4_3200mhz__3_.jpg', 4, '16', '3200', NULL),
(3, 'Ram Desktop Adata XPG LANCER Black (AX5U5200C388G-CLABK)', 'Adata', 899000, 'https://hanoicomputercdn.com/media/product/85872_ram_desktop_adata_xpg_lancer_black___1_.jpg', 5, '8', '5200', ' 29-5 25-1'),
(4, 'Ram Desktop Corsair Vengeance LPX (CMK16GX5M1B5600C40)', 'Corsair', 1599000, 'https://hanoicomputercdn.com/media/product/86270_file_pts_chu___n_l____0000_layer_1.jpg', 5, '16', '5600', NULL),
(5, 'Ram Desktop Kingmax (KM-LD5-4800-16GS)', 'Kingmax', 1529000, 'https://hanoicomputercdn.com/media/product/85434_ram_desktop_kingmax_km_ld5_4800_16gs_16g_1x_16b_ddr5_4800mhz_0001_layer_1.jpg', 5, '16', '4800', ' 29-5'),
(6, 'Ram Desktop Kingston (KVR16N11/8 / KVR16N11/8WP)', 'Kingston', 1199000, 'https://hanoicomputercdn.com/media/product/62905_ram_desktop_kingston_kvr16n11_8_kvr16n11_8wp_8gb_1x8gb_ddr3_1600mhz.jpg', 3, '8', '1600', NULL),
(7, 'Ram Desktop Lexar Thor (LD4BU016G-R3200GSXG) test', 'Lexar', 989000, 'https://hanoicomputercdn.com/media/product/86103_ram_desktop_lexar_thor_ld4bu016g_r3200gsxg_16gb_1x16gb_ddr4_3200mhz.jpg', 4, '16', '3200', ' 29-5'),
(8, 'Ram Desktop Gskill Aegis (F4-2666C19S-8GIS)', 'Gskill', 559000, 'https://hanoicomputercdn.com/media/product/62340_ram_desktop_gskill_aegis_f4_2666c19s_8gis_8gb_1x8gb_ddr4_2666mhz.jpg', 4, '8', '2666', NULL),
(9, 'Ram Desktop PNY XLR8 RGB (MD16GD4320016XRGB)', 'PNY', 999000, 'https://hanoicomputercdn.com/media/product/79086_ram_desktop_pny_xlr8_rgb_md16gd4320016xrgb_16gb_1x16gb_ddr4_3200mhz__3_.jpg', 4, '16', '3200', NULL),
(10, 'Ram Desktop Billion Reservoir Elite HeatSink Black (BR-PC-16G-5600)', 'Billion Reservoir', 1349000, 'https://hanoicomputercdn.com/media/product/86220_ram_desktop_billion_reservoir_elite_heatsink_black_br_pc_16g_4800_16gb_1x16gb_ddr5_4800mhz.jpg', 5, '16', '4800', ' 29-5');

-- --------------------------------------------------------

--
-- Table structure for table `motherboard`
--

CREATE TABLE `motherboard` (
  `id` int(11) NOT NULL,
  `brand` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `socket_type` varchar(50) DEFAULT NULL,
  `chipset` varchar(50) DEFAULT NULL,
  `memory_slots` int(11) DEFAULT NULL,
  `max_memory_capacity` int(11) DEFAULT NULL,
  `ddr` varchar(20) DEFAULT NULL,
  `expansion_slots` varchar(20) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `motherboard`
--

INSERT INTO `motherboard` (`id`, `brand`, `name`, `socket_type`, `chipset`, `memory_slots`, `max_memory_capacity`, `ddr`, `expansion_slots`, `price`, `image`, `ratings`) VALUES
(1, 'ASUS', 'ASUS TUF GAMING B760M-PLUS WIFI', 'LGA1700', 'Intel B76067', 4, 128, '4', '1 x PCIe 5.0 x16', 12000000, 'https://lh3.googleusercontent.com/gnVyMH0H5i22jxYof4a23J9KKgG5hTdRV5TG-RpXemFooLAQAnMFiMsj7zqXI5c9ducEiSpozBorIlbNafybxcMrPvsspfU=w1000-rw', NULL),
(2, 'MSI', 'MSI MEG Z890 GODLIKE DDR5', 'LGA1851', 'Intel Z890', 4, 256, '5', '2 x PCI-E x16 slots', 39990000, 'https://hanoicomputercdn.com/media/product/86763_mainboard_msi_meg_z890_godlike_ddr5__4_.jpg', NULL),
(3, 'ASUS', 'ASUS ROG CROSSHAIR X670E GENE', 'AM5', 'AMD X670', 2, 64, '5', '1 x PCI-E 5.0 x16', 13990000, 'https://mega.com.vn/media/product/23410_mainboard_asus_rog_crosshair_x670e_gene.jpg', NULL),
(4, 'GIGABYTE', 'Gigabyte TRX40 AORUS XTREME', 'sTR5', 'AMD TRX40', 8, 256, '4', '4 x PCIe x16 slots', 24300000, 'https://mega.com.vn/media/product/15407_mainboard_gigabyte_trx40_aorus_xtreme.png', NULL),
(5, 'ASROCK', 'ASROCK B550M PRO4', 'AM4', 'AMD B550', 4, 128, '4', '2 x PCI Express x16', 2590000, 'https://mega.com.vn/media/product/17418_mainboard_asrock_b550m_pro4.png', ' 29-5'),
(6, 'ASUS', 'ASUS ROG STRIX B760-G GAMING WIFI DDR5', 'LGA1700', 'Intel B760', 4, 192, '5', '1 x PCIe 5.0 x16 slo', 5400000, 'https://hanoicomputercdn.com/media/product/77917_mainboard_asus_rog_strix_b760_g_gaming_wifi_ddr5__3_.jpg', NULL),
(7, 'ASUS', 'ASUS ROG MAXIMUS Z890 EXTREME DDR5', 'LGA1851', 'Intel Z890', 4, 192, '4', '2 x PCIe 5.0 x16 slo', 28999000, 'https://hanoicomputercdn.com/media/product/86789_mainboard_asus_rog_maximus_z890_extreme_ddr5__1_.jpg', NULL),
(8, 'ASROCK', 'ASROCK B760M Steel Legend WiFi', 'LGA1700', 'Intel B760', 4, 192, '5', '1 x PCIe 5.0 x16 slo', 4049000, 'https://hanoicomputercdn.com/media/product/69779_mainboard_asrock_b760m_steel_legend_wifi__2_.jpg', ' 25-3'),
(9, 'MSI', 'MSI X670E GAMING PLUS WIFI DDR5', 'AM5', 'AMD X670', 4, 255, '5', '3 x PCIe x16, 1 x PC', 8199000, 'https://hanoicomputercdn.com/media/product/85675_mainboard_msi_x670e_gaming_plus_wifi_ddr5__2_.jpg', NULL),
(10, 'GIGABYTE', 'Gigabyte X670 AORUS ELITE AX', 'AM5', 'AMD X670', 4, 128, '5', '1 x PCIe x16 slot', 8399000, 'https://hanoicomputercdn.com/media/product/68590_mainboard_gigabyte_x670_aorus_elite_ax__6_.jpg', NULL),
(11, 'ASUS', 'ASUS ROG MAXIMUS Z790 HERO DDR5', 'LGA1700', 'Intel Z790', 4, 128, '5', '2 x PCIe 5.0 x16 slo', 16499000, 'https://hanoicomputercdn.com/media/product/68460_mainboard_asus_rog_maximus_z790_hero__2_.jpg', NULL),
(12, 'ASUS', 'ASUS PRIME A520M-K', 'AM4', 'AMD A520', 2, 128, '4', '1 x PCIe 3.0 x16 (x1', 1499000, 'https://hanoicomputercdn.com/media/product/54924_prime_a520m_k_01.jpg', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `operatingsystem`
--

CREATE TABLE `operatingsystem` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `version` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `brand` varchar(20) DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `operatingsystem`
--

INSERT INTO `operatingsystem` (`id`, `name`, `version`, `price`, `image`, `brand`, `ratings`) VALUES
(1, 'Microsoft Windows Server Standard 2022 64-bit English', 'Standard 2022 64-bit', 20499000, 'https://hanoicomputercdn.com/media/product/62463_p73_08328.png', 'Microsoft', NULL),
(2, 'Microsoft Windows 10 Pro for Workstations 64-bit', 'Windows 10 Pro For Workstations 64-bit', 6269000, 'https://hanoicomputercdn.com/media/product/49335_h______i___u_h__nh_microsoft_windows_10_pro.jpg', 'Microsoft', NULL),
(3, 'Microsoft Windows 11 Pro 64-bit English International 1pk DSP OEI DVD', 'Windows 11 Pro 64-bit', 3048000, 'https://hanoicomputercdn.com/media/product/65829_windows_11_pro_64bit_eng_intl_1pk_dsp_oei_dvd.jpg', 'Microsoft', NULL),
(4, 'Microsoft Windows 11 Home 64-bit English International 1pk DSP OEI DVD', 'Windows 11 Home 64-bit', 2689000, 'https://hanoicomputercdn.com/media/product/67818_windows_11_home_64bit_eng_intl_1pk_dsp_oei_dvd_kw9_00632.jpg', 'Microsoft', NULL),
(5, 'Microsoft Windows 11 Home FPP 64-bit English International USB', 'Windows 11 Home 64-bit FPP USB', 3499000, 'https://hanoicomputercdn.com/media/product/71289_windows_11_home.jpg', 'Microsoft', ' 29-4');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `items` text DEFAULT NULL,
  `order_date` datetime DEFAULT NULL,
  `status` enum('pending','processed','shipped','delivered','cancelled') DEFAULT NULL,
  `total_amount` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `payment_method` enum('Bank','COD') DEFAULT NULL,
  `payment_status` enum('pending','paid','cancelled') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `customer_id`, `items`, `order_date`, `status`, `total_amount`, `address`, `payment_method`, `payment_status`) VALUES
(14, 29, 'processor-15-1 processor-2-1 processor-4-1', '2024-11-21 15:30:48', 'cancelled', 30897000, 'supper sexy man', 'COD', 'pending'),
(15, 25, 'graphicscard-1-1 motherboard-8-1 processor-1-1', '2024-11-30 21:33:54', 'pending', 83747000, 'vku', 'Bank', NULL),
(16, 29, 'cpucooler-2-1 graphicscard-1-1 graphicscard-11-1 motherboard-10-1 motherboard-11-1 operatingsystem-1-1 pccase-2-1 powersupply-2-6 processor-2-4 storage-2-7', '2024-12-03 13:56:03', 'pending', 195516000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'COD', NULL),
(17, 29, 'processor-4-1 processor-6-1 processor-8-1', '2024-12-15 10:41:58', 'cancelled', 30597000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'Bank', 'pending'),
(18, 29, 'cpucooler-4-1 graphicscard-1-1 memory-1-1 motherboard-12-1 operatingsystem-5-1 pccase-2-1 powersupply-1-1 processor-11-1 storage-1-1', '2024-12-15 11:16:34', 'shipped', 102581000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'COD', NULL),
(19, 29, 'cpucooler-3-1', '2024-12-15 11:52:30', 'cancelled', 1699000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'COD', 'paid'),
(20, 30, 'processor-4-1 processor-6-1', '2024-12-19 11:29:08', NULL, 24498000, 'sdSDádasdsad', 'COD', 'pending'),
(21, 30, 'processor-4-1 processor-6-1', '2024-12-19 11:39:25', 'shipped', 24498000, 'vbcvb', 'COD', 'cancelled'),
(22, 29, 'motherboard-2-1 storage-2-1', '2024-12-24 14:20:13', 'shipped', 40989000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'COD', 'pending'),
(23, 25, 'motherboard-8-1', '2024-12-24 20:58:37', 'shipped', 4049000, 'vku', 'COD', 'cancelled'),
(24, 29, 'cpucooler-1-1 graphicscard-3-1 memory-5-4 motherboard-6-1 operatingsystem-3-1 pccase-1-1 powersupply-1-1 processor-2-1 storage-9-1', '2024-12-25 14:10:26', 'shipped', 83809000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'COD', 'pending'),
(25, 29, 'memory-5-1 operatingsystem-2-1', '2025-03-08 11:45:08', 'cancelled', 7798000, '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang', 'Bank', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `pccase`
--

CREATE TABLE `pccase` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `brand` varchar(20) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `size` text DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pccase`
--

INSERT INTO `pccase` (`id`, `name`, `brand`, `price`, `image`, `size`, `ratings`) VALUES
(1, 'Case Asus GR701 ROG Hyperion White Edition', 'Asus', 9999000, 'https://hanoicomputercdn.com/media/product/78030_rog_hyperion_gr701_white_edition_1.jpg', 'E-ATX', ' 29-3'),
(2, 'Case DeepCool MATREXX 40 ', 'DeepCool', 699000, 'https://hanoicomputercdn.com/media/product/82421_vo_case_deepcool_matrexx_40_matx_mid_tower_mau_den_1_fan__3_.jpg', ' M-ATX, Mini-ITX', NULL),
(3, 'Case Corsair 3500X Tempered Glass - White', 'Corsair', 1899000, 'https://hanoicomputercdn.com/media/product/86049_corsair_3500x_white.jpg', 'E-ATX', NULL),
(4, 'Case EDRA ECS1303 Black', 'EDRA', 369000, 'https://hanoicomputercdn.com/media/product/85599_vo_case_edra_ecs1303_black_matx_mau_den__2_.jpg', 'M-ATX, ITX', NULL),
(5, 'Case Cougar DarkBlader-S ARGB', 'Cougar ', 1499000, 'https://hanoicomputercdn.com/media/product/70520_dark_blader_g__5_.jpg', 'Mini ITX, M-ATX, ATX, CEB, E-ATX', NULL),
(6, 'Case Cooler Master MasterBox TD500TG Mesh ARGB', 'Cooler Master', 1999000, 'https://hanoicomputercdn.com/media/product/51619_vo_case_cooler_master_masterbox_td500tg_mesh_argb_mid_tower_mau_den_led_argb_mat_luoi_5.png', 'Mini ITX, Micro ATX, ATX, SSI CEB, E-ATX', ' 29-4'),
(7, 'Case DARKFLASH DY470 BLACK', 'DarkFlash', 1999000, 'https://hanoicomputercdn.com/media/product/86424_vo_case_darkflash_dy470_black_atx_mid_tower_mau_den__9_.jpg', 'ATX, M-ATX, ITX', NULL),
(8, 'Case AIGO C218M BLACK', 'AIGO', 599000, 'https://hanoicomputercdn.com/media/product/86431_vo_case_aigo_c218m_black_matx_mau_den_khong_fan__4_.jpg', 'M-ATX, Mini ITX', NULL),
(9, ' Case Fractal Design North Chalk White TG Clear Tint', 'Fractal ', 3799000, 'https://hanoicomputercdn.com/media/product/76228_v____case_fractal_design_north_chalk_white_tg_clear_tint___1_.jpg', 'ATX, mATX, Mini-ITX', NULL),
(10, 'Case ANTEC C3 Basic', 'ANTEC ', 999000, 'https://hanoicomputercdn.com/media/product/84397_vo_case_antec_c3_basic_atx_mau_den__4_.jpg', 'ATX, Micro-ATX, ITX', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `powersupply`
--

CREATE TABLE `powersupply` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `brand` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `wattage` int(11) DEFAULT NULL,
  `efficiency_rating` text DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `powersupply`
--

INSERT INTO `powersupply` (`id`, `name`, `brand`, `price`, `image`, `wattage`, `efficiency_rating`, `ratings`) VALUES
(1, 'ASUS ROG THOR 1600T Gaming Titanium', 'ASUS', 16699000, 'https://hanoicomputercdn.com/media/product/66952_rog_thor_1600t_01.jpg ', 1600, '80 PLUS Platinum Certified', ' 29-5'),
(2, 'ACER AC1000 Gold Full Modular', 'ACER', 3539000, 'https://hanoicomputercdn.com/media/product/81025_ngu___n_acer_ac1000_gold_full_modular__2_.jpg', 1000, '80 PLUS Gold', ' 29-2'),
(3, 'Gigabyte GP-UD1000GM PG5', 'Gigabyte', 4299000, 'https://hanoicomputercdn.com/media/product/68153_ngu___n_gigabyte_gigabyte_gp_ud1000gm_pg5_1000w___2_.jpg', 1000, '80 PLUS Gold', NULL),
(4, 'SEGOTEP QPOWER 350', 'Segotep', 399000, 'https://hanoicomputercdn.com/media/product/86736__nguon_segotep_qpower_350__1_.jpg', 350, '80 PLUS', NULL),
(5, 'Xigmatek Litepower i450', 'Xigmatek', 479000, 'https://hanoicomputercdn.com/media/product/86736__nguon_segotep_qpower_350__1_.jpg', 450, '75%', NULL),
(6, 'Jetek Model G450', 'Jetek', 649000, 'https://hanoicomputercdn.com/media/product/84896_nguon_jetek_model_g450__3_.jpg', 450, '80 PLUS', NULL),
(7, 'Cooler Master Elite V3 230V PC500', 'Cooler Master', 829000, 'https://hanoicomputercdn.com/media/product/52101_pwcm128.jpg', 500, 'Active PFC', NULL),
(8, 'DeepCool PX1000-G', 'DeepCool', 4399000, 'https://hanoicomputercdn.com/media/product/76369_ngu___n_deepcool_px1000_g_1000w_80plus_gold__6_.jpg', 1000, '80 PLUS Gold / Cybenetics Platinum', ' 29-4'),
(9, 'MSI MAG A850GL', 'MSI', 2899000, 'https://hanoicomputercdn.com/media/product/74913_ngu___n_m__y_t__nh_msi_mag_a850gl_pcie_5_2.jpg', 850, '80 PLUS Gold', NULL),
(10, 'VSP VGP650BRU PRO', 'VSP', 879000, 'https://hanoicomputercdn.com/media/product/86862_nguon_vsp_vgp650bru_pro_650w_80plus_bronze__1_.jpg ', 650, '80 PLUS', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `processor`
--

CREATE TABLE `processor` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `brand` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `core_count` int(11) DEFAULT NULL,
  `thread_count` int(11) DEFAULT NULL,
  `socket_type` text DEFAULT NULL,
  `TDP` int(11) DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `processor`
--

INSERT INTO `processor` (`id`, `name`, `brand`, `price`, `image`, `core_count`, `thread_count`, `socket_type`, `TDP`, `ratings`) VALUES
(1, ' CPU Intel Core Ultra 9 285K', 'Intel', 17699000, 'https://hanoicomputercdn.com/media/product/86961_cpu_intel_core_ultra_9_285k_up_to_5_5ghz_24_nhan_24_luong_36mb_cache_125w_socket_intel_lga_1700_arrow_lake.jpg', 24, 24, 'LGA1851', 125, NULL),
(2, 'CPU INTEL CORE I9-14900K', 'Intel', 13599000, 'https://hanoicomputercdn.com/media/product/77007_cpu_intel_core_i9_14900k.jpg', 24, 32, 'LGA1700', 125, NULL),
(3, 'Core i9-13900K', 'Intel', 15199000, 'https://hanoicomputercdn.com/media/product/68378_cpu_intel_core_i9_13900__3_.jpg', 24, 32, 'LGA1700', 125, NULL),
(4, 'Ryzen 9 7950X', 'AMD', 15199000, 'https://hanoicomputercdn.com/media/product/67740_cpu_amd_ryzen_9_7950x_4_5_ghz_upto_5_7ghz_81mb_16_cores_32_threads_170w_socket_am5.jpg', 16, 32, 'AM5', 170, NULL),
(5, 'Core i7-13700K', 'Intel', 9599000, 'https://hanoicomputercdn.com/media/product/68380_cpu_intel_core_i7_13700k_3_4ghz_turbo_up_to_5_4ghz_16_nhan_24_luong_24mb_cache_125w_socket_intel_lga_1700_alder_lake.jpg', 16, 24, 'LGA1700', 125, NULL),
(6, 'Ryzen 7 7700X', 'AMD', 9299000, 'https://hanoicomputercdn.com/media/product/67742_cpu_amd_ryzen_7_7700x_4_5_ghz_upto_5_4ghz_40mb_8_cores_16_threads_105w_socket_am5.jpg', 8, 16, 'AM5', 105, ' 29-5 25-1'),
(7, 'Core i5-13600K', 'Intel', 7899000, 'https://hanoicomputercdn.com/media/product/68383_cpu_intel_core_i5_13600k_3_5ghz_turbo_up_to_5_1ghz_14_nhan_20_luong_20mb_cache_125w_socket_intel_lga_1700_alder_lake.jpg', 14, 20, 'LGA1700', 125, NULL),
(8, 'Ryzen 5 7600X', 'AMD', 6099000, 'https://hanoicomputercdn.com/media/product/67743_cpu_amd_ryzen_5_7600x_4_7_ghz_upto_5_3ghz_38mb_6_cores_12_threads_105w_socket_am5_fix.jpg', 6, 12, 'AM5', 105, NULL),
(9, 'Ryzen 9 7900X', 'AMD', 10999000, 'https://hanoicomputercdn.com/media/product/67741_cpu_amd_ryzen_9_7900x_4_7_ghz_upto_5_6ghz_76mb_12_cores_24_threads_170w_socket_am5.jpg', 12, 24, 'AM5', 170, NULL),
(10, 'Core i7-14700K', 'Intel', 10599000, 'https://hanoicomputercdn.com/media/product/77008_cpu_intel_core_i7_14700k.jpg', 20, 28, 'LGA1700', 125, NULL),
(11, 'Ryzen 7 5800X3D', 'AMD', 8599000, 'https://hanoicomputercdn.com/media/product/65305_cpu_amd_ryzen_7_5800x3d_22.jpg', 8, 16, 'AM4', 105, NULL),
(12, 'Core i5-14600K', 'Intel', 6699000, 'https://hanoicomputercdn.com/media/product/77009_cpu_intel_core_i5_14600k.jpg', 14, 20, 'LGA1700', 125, NULL),
(13, 'Ryzen 5 5600X', 'AMD', 3499000, 'https://hanoicomputercdn.com/media/product/56282_cpu_amd_ryzen_5_5600x.jpg', 6, 12, 'AM4', 65, NULL),
(14, 'Core i3-13100', 'Intel', 3399000, 'https://hanoicomputercdn.com/media/product/69897_cpu_intel_core_i3_13100_up_to_4_5ghz_4_nhan_10_luong_12mb_cache_65w_socket_intel_lga_1700_raptor_lake.jpg', 4, 8, 'LGA1700', 65, NULL),
(15, 'Ryzen 5 5500', 'AMD', 2099000, 'https://hanoicomputercdn.com/media/product/65334_cpu_amd_ryzen_5_5500_3_6_ghz_upto_4_2ghz_19mb_6_cores_12_threads_65w_socket_am4.jpg', 6, 12, 'AM4', 65, NULL),
(16, 'Threadripper 7960X', 'AMD', 42999000, 'https://hanoicomputercdn.com/media/product/78112_cpu_amd_ryzen_threadripper_7960x_4_2ghz_up_to_5_3ghz_153mb_24_cores_48_threads_350w_socket_str5.jpg', 24, 48, 'sTR5', 350, NULL),
(18, 'test', 'test', 12344, '#', 1, 1, '1', 1, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `storage`
--

CREATE TABLE `storage` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `brand` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `image` text DEFAULT NULL,
  `type` text DEFAULT NULL,
  `capacity` text DEFAULT NULL,
  `speed` text DEFAULT NULL,
  `port` text DEFAULT NULL,
  `ratings` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `storage`
--

INSERT INTO `storage` (`id`, `name`, `brand`, `price`, `image`, `type`, `capacity`, `speed`, `port`, `ratings`) VALUES
(1, ' HDD Seagate SkyHawk AI', 'SEAGATE', 6999000, 'https://hanoicomputercdn.com/media/product/60093_o_cung_hdd_seagate_skyhawk_ai_10tb_st10000ve0008_1.jpg', 'HDD', '10TB', '7200 RPM', 'SATA 3.5', NULL),
(2, 'HDD Toshiba AV V300', 'Toshiba ', 999000, 'https://hanoicomputercdn.com/media/product/44284_hdd_toshiba_videostream_1tb.jpg', 'HDD', '1TB', '5700RPM', 'SATA 3.5', NULL),
(3, 'HDD Synology Plus HAT3300', 'Synology ', 3699000, 'https://hanoicomputercdn.com/media/product/84644_o_cung_hdd_synology_plus_hat3300_4tb_3_5_inch_5400rpm_sata_6gb_s.jpg', 'HDD', '4TB', '5400RPM', 'SATA 3.5', NULL),
(4, 'HDD Western Digital 2TB Blue  (WD20EZBX)', 'Western Digital ', 1599000, 'https://hanoicomputercdn.com/media/product/67637_hdd_western_caviar_blue__0000_layer_1.jpg', 'HDD', '2TB', '7200RPM', 'SATA 3.5', NULL),
(5, 'HDD Seagate Exos 24TB ( ST24000NM002H )', 'SEAGATE', 29999000, 'https://hanoicomputercdn.com/media/product/83586_o_cung_hdd_seagate_exos_24tb_st24000nm002h.jpg', 'HDD', '24TB', '7200rpm', 'SATA 3.5', NULL),
(6, 'SSD Samsung MZ-7L37T600', 'Samsung', 34499000, 'https://hanoicomputercdn.com/media/product/87229_ssd_samsung_mz_7l31t900_pm893__5_.jpg', 'SSD', '7.68TB', 'Read: 550 MB/s\r\nWrite: 520 MB/s', 'SATA 2.5', NULL),
(7, 'Kingston A400 240GB', 'Kingston ', 619000, 'https://hanoicomputercdn.com/media/product/38002_____c___ng_ssd_kingston_a400_240gb_2_5_inch_sata3.jpg', 'SSD', '240GB', 'Read: 500 MB/s\r\nWrite: 450 MB/s', 'SATA 2.5', ' 29-3'),
(8, 'SSD Lexar LNM610 PRO 500GB ', 'Lexar', 1049000, 'https://hanoicomputercdn.com/media/product/71165_ssd_lexar_lnm610_pro__2_.jpg', 'SSD', '500GB', 'Read: 3300 MB/s\r\nWrite: 1700 MB/s', 'M.2 PCIe ', NULL),
(9, 'SSD Adata Legend 850 Lite 1TB', 'Adata', 1899000, 'https://hanoicomputercdn.com/media/product/86852_o_cung_ssd_adata_legend_850_lite_1tb_m__2_.jpg', 'SSD', '1000GB', 'Read: 5000 MB/s\r\nWrite: 4200 MB/s', 'M.2 PCIe ', ' 25-1'),
(10, 'SSD WD Green 240GB (WDS240G3G0B)', 'Western Digital ', 629000, 'https://hanoicomputercdn.com/media/product/69685_o_cung_ssd_wd_green_240gb_m__1_.jpg', 'SSD', '240GB', 'Read: 545 MB/s\r\nWrite: 465 MB/s', 'M.2 SATA', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `profile_image` varchar(255) NOT NULL DEFAULT 'default.jpg',
  `cart` text DEFAULT NULL,
  `buildset` text NOT NULL,
  `address` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password_hash`, `date_of_birth`, `profile_image`, `cart`, `buildset`, `address`) VALUES
(25, 'Phụng_Nguyễn', 'nguyenvanphung270505@gmail.com', '$2y$10$h93AFfHanbkVpq00pjU65OQB4DlFNI6om4g3BWmaYbfSbR1FjFGaW', '2005-01-01', 'profile_images/Phụng_Nguyễn.png', '', 'motherboard-3 processor-9', ''),
(29, 'JoshiMinh', 'binhangia241273@gmail.com', '$2y$10$miTUIixRpYfb5m4bJfFaK.uMPtRPTPZBJyBpkHv.BNkXU3uMgpXTu', '2005-10-20', 'profile_images/JoshiMinh.jpg', 'memory-2-3 memory-4-1 memory-7-1 operatingsystem-1-1 processor-2-1', '', '47 Bui Huu Nghia, An Hai Bac, Son Tra, Da Nang');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`);

--
-- Indexes for table `cpucooler`
--
ALTER TABLE `cpucooler`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `graphicscard`
--
ALTER TABLE `graphicscard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `memory`
--
ALTER TABLE `memory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `motherboard`
--
ALTER TABLE `motherboard`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `operatingsystem`
--
ALTER TABLE `operatingsystem`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `pccase`
--
ALTER TABLE `pccase`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `powersupply`
--
ALTER TABLE `powersupply`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `processor`
--
ALTER TABLE `processor`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `storage`
--
ALTER TABLE `storage`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `cpucooler`
--
ALTER TABLE `cpucooler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `graphicscard`
--
ALTER TABLE `graphicscard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `memory`
--
ALTER TABLE `memory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `motherboard`
--
ALTER TABLE `motherboard`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `operatingsystem`
--
ALTER TABLE `operatingsystem`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `pccase`
--
ALTER TABLE `pccase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `powersupply`
--
ALTER TABLE `powersupply`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `processor`
--
ALTER TABLE `processor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `storage`
--
ALTER TABLE `storage`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
