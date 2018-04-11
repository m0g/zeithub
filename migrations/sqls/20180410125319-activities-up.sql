/* Replace with your SQL commands */
CREATE TABLE IF NOT EXISTS activities (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name TEXT,
  description TEXT,
  duration_minutes INTEGER,
  start_time TIMESTAMP DEFAULT '1970-01-01 00:00:01',
  end_time TIMESTAMP DEFAULT '1970-01-01 00:00:01',
  project_id INTEGER
);
