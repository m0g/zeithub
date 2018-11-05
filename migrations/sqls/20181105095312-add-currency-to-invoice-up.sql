ALTER TABLE `invoices` 
ADD COLUMN `currency_code` VARCHAR(3) NOT NULL DEFAULT 'EUR' AFTER `user_address_id`;
