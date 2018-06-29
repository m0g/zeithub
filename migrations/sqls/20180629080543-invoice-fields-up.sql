ALTER TABLE `invoices` 
ADD COLUMN `discount` INT(11) NOT NULL DEFAULT 0 AFTER `amount`,
ADD COLUMN `tax` INT(11) NOT NULL DEFAULT 0 AFTER `discount`,
ADD COLUMN `memo` TEXT NULL AFTER `tax`,
ADD COLUMN `client_address_id` INT(11) NULL AFTER `bank_account_id`,
ADD COLUMN `user_address_id` INT(11) NULL AFTER `client_address_id`;