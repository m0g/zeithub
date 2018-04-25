ALTER TABLE `users` 
ADD COLUMN `first_name` VARCHAR(45) NULL AFTER `admin`,
ADD COLUMN `last_name` VARCHAR(45) NULL AFTER `first_name`,
ADD COLUMN `tel` VARCHAR(40) NULL AFTER `last_name`,
ADD COLUMN `website` TEXT NULL AFTER `tel`;
