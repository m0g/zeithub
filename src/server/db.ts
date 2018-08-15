import * as mysql from "mysql2/promise";

const {
  NODE_ENV,
  CLEARDB_DATABASE_URL,
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_NAME_TEST,
  DB_PASSWD
} = process.env;
console.log("NODE_ENV", NODE_ENV);

const checkTypes = row => {
  for (const key of Object.keys(row)) {
    if (key === "durationMinutes") {
      row[key] = parseInt(row[key]);
    }
  }

  return row;
};

export default class DB {
  private pool: mysql.pool;
  private connection: mysql.connection;

  constructor() {
    if (CLEARDB_DATABASE_URL) {
      this.pool = mysql.createPool(CLEARDB_DATABASE_URL);
    } else {
      this.pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWD,
        database: NODE_ENV == "test" ? DB_NAME_TEST : DB_NAME
      });
    }
  }

  async init() {
    this.connection = await this.pool.getConnection();
    return true;
  }

  async query(sql) {
    const [results] = await this.pool.query(sql);

    return results.map(checkTypes);
  }

  async queryOne(sql) {
    const [results] = await this.pool.query(sql);
    return results.length > 0 ? checkTypes(results[0]) : false;
  }

  async execute(sql, data) {
    const [results] = await this.pool.execute(sql, data);
    return results ? results.insertId : false;
  }
}
