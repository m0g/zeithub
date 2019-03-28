ALTER TABLE `items`
CHANGE COLUMN `amount` `unit_price` decimal(15,2),
ADD COLUMN `qty` INTEGER NULL AFTER `title`;