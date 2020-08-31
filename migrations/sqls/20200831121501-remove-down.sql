/* Replace with your SQL commands */
CREATE TABLE `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `user_id` int NOT NULL,
  `item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=227 DEFAULT CHARSET=utf8;
