import * as mysql from 'mysql2/promise';

export default class DB {
  private connection: mysql.connection;

  constructor() {
  }

  async init() {
    if (process.env.CLEARDB_DATABASE_URL) {
      this.connection = await mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
    } else {
      this.connection = await mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWD,
        database : process.env.DB_NAME,
      });
    }

    return true;
  }

  async query(sql) {
    const [results] = await this.connection.query(sql);
    return results;
  }

  async queryOne(sql) {
    const [results] = await this.connection.query(sql);
    return results.length > 0 ? results[0] : false;
  }

  async execute(sql) {
    const [results] = await this.connection.execute(sql);

    return results ? results.insertId : false;
  }
};