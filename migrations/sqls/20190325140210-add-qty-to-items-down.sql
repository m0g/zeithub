ALTER TABLE `items`
RENAME COLUMN `unit_price` TO `amount`,
DROP COLUMN `qty`;