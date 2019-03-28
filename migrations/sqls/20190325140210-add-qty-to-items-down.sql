ALTER TABLE `items`
CHANGE COLUMN `unit_price` `amount` decimal(15,2),
DROP COLUMN `qty`;