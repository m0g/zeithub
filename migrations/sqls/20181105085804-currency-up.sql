CREATE TABLE `currencies` (
  `code` VARCHAR(3) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `sign` VARCHAR(45) NOT NULL,
  `leading` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`code`));
