ALTER TABLE `addresses` 
CHANGE COLUMN `user_id` `user_id` INT(11) NOT NULL ,
DROP COLUMN `client_id` INT(11) NULL AFTER `user_id`;
