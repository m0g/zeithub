/* Replace with your SQL commands */
ALTER TABLE `activities`
CHANGE COLUMN `name` `name` TEXT NOT NULL ,
CHANGE COLUMN `duration_minutes` `duration_minutes` INT(11) NOT NULL ,
CHANGE COLUMN `start_time` `start_time` DATETIME NOT NULL DEFAULT '1970-01-01 00:00:01' ,
CHANGE COLUMN `end_time` `end_time` DATETIME NOT NULL DEFAULT '1970-01-01 00:00:01' ,
CHANGE COLUMN `project_id` `project_id` INT(11) NOT NULL ,
CHANGE COLUMN `user_id` `user_id` INT(11) NOT NULL ;
