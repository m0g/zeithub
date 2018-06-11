CREATE TABLE `addresses` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `street` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `postcode` VARCHAR(45) NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `user_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`));