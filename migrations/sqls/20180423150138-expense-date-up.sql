/* Replace with your SQL commands */
ALTER TABLE `expenses` 
CHANGE COLUMN `name` `name` TEXT NOT NULL ,
CHANGE COLUMN `amount` `amount` DECIMAL(10,0) NOT NULL ,
CHANGE COLUMN `user_id` `user_id` INT(11) NOT NULL ,
ADD COLUMN `date` DATE NOT NULL AFTER `name`;
