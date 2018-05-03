/* Replace with your SQL commands */
CREATE TABLE `invoices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `number` INT NOT NULL,
  PRIMARY KEY (`id`));