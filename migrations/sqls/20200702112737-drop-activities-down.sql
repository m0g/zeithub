/* Replace with your SQL commands */

CREATE TABLE `activities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `description` text,
  `duration_minutes` int NOT NULL,
  `start_time` datetime NOT NULL DEFAULT '1970-01-01 00:00:01',
  `end_time` datetime NOT NULL DEFAULT '1970-01-01 00:00:01',
  `tracked` tinyint NOT NULL DEFAULT '1',
  `project_id` int NOT NULL,
  `user_id` int NOT NULL,
  `invoice_id` int DEFAULT NULL,
  `item_id` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=241 DEFAULT CHARSET=utf8