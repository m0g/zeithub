/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS expenses (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  amount DECIMAL,
  user_id INTEGER
);
