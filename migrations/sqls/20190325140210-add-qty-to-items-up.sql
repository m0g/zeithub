ALTER TABLE `items`
RENAME COLUMN `amount` TO `unit_price`,
ADD COLUMN `qty` INTEGER NULL AFTER `title`;