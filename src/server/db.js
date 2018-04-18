const mysql = require('mysql2/promise');

class DB {
  async init() {
    this.connection = await mysql.createConnection({
      host     : process.env.DB_HOST,
      user     : process.env.DB_USER,
      password : process.env.DB_PASSWD,
      database : process.env.DB_NAME,
    });

    return true;
  }

  async query(sql) {
    const [results] = await this.connection.query(sql);
    return results;
  }
}

module.exports = DB;