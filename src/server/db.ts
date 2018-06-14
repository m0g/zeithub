import * as mysql from 'mysql2/promise';

export default class DB {
  private pool: mysql.pool;
  private connection: mysql.connection;

  constructor() {
    if (process.env.CLEARDB_DATABASE_URL) {
      this.pool = mysql.createPool(process.env.CLEARDB_DATABASE_URL);
    } else {
      this.pool = mysql.createPool({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASSWD,
        database : process.env.DB_NAME,
      });
    }
  }

  async init() {
    this.connection = await this.pool.getConnection();
    return true;
  }

  async query(sql) {
    const [results] = await this.pool.query(sql);
    return results;
  }

  async queryOne(sql) {
    const [results] = await this.pool.query(sql);
    return results.length > 0 ? results[0] : false;
  }

  async execute(sql) {
    const [results] = await this.pool.execute(sql);
    return results ? results.insertId : false;
  }
};