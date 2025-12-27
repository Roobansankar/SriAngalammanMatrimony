-- Fix NOT NULL columns that are missing default values
-- Run this on your MySQL database to prevent future registration errors

-- Option 1: Change TEXT back to VARCHAR with defaults (recommended)
-- This allows MySQL to enforce defaults at the database level

ALTER TABLE `register` 
  MODIFY `horos_status` varchar(20) COLLATE latin1_general_ci NOT NULL DEFAULT 'No',
  MODIFY `online_status` varchar(20) COLLATE latin1_general_ci NOT NULL DEFAULT 'offline',
  MODIFY `visibility` varchar(20) COLLATE latin1_general_ci NOT NULL DEFAULT 'visible',
  MODIFY `follow` varchar(20) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  MODIFY `shani` varchar(100) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  MODIFY `parigarasevai` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  MODIFY `Sevai` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  MODIFY `Raghu` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  MODIFY `Keethu` varchar(50) COLLATE latin1_general_ci NOT NULL DEFAULT '',
  MODIFY `crop` varchar(10) COLLATE latin1_general_ci NOT NULL DEFAULT '0';

-- Option 2: If you prefer to keep TEXT columns, remove NOT NULL constraint
-- (The application code now handles defaults, so this is safe)
-- 
-- ALTER TABLE `register` 
--   MODIFY `horos_status` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `online_status` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `visibility` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `follow` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `shani` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `parigarasevai` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `Sevai` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `Raghu` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `Keethu` text COLLATE latin1_general_ci DEFAULT NULL,
--   MODIFY `crop` text COLLATE latin1_general_ci DEFAULT NULL;

-- Verify the changes
-- SELECT COLUMN_NAME, COLUMN_TYPE, IS_NULLABLE, COLUMN_DEFAULT 
-- FROM INFORMATION_SCHEMA.COLUMNS 
-- WHERE TABLE_NAME = 'register' 
-- AND COLUMN_NAME IN ('horos_status', 'online_status', 'visibility', 'follow', 'shani', 'parigarasevai', 'Sevai', 'Raghu', 'Keethu', 'crop');
