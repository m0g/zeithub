/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS users (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  email TEXT,
  name TEXT,
  password TEXT NOT NULL,
  admin BOOLEAN NOT NULL DEFAULT 0
);
