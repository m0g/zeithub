ALTER TABLE `invoices` 
ADD COLUMN `bank_account_id` INT(11) NOT NULL AFTER `project_id`;
