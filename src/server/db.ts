import { Pool, Connection, createPool } from 'mysql2/promise';
import { PoolOptions } from 'mysql2/typings/mysql';

const {
  NODE_ENV,
  CLEARDB_DATABASE_URL,
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_NAME_TEST,
  DB_PASSWD,
} = process.env;
console.log('NODE_ENV', NODE_ENV);

const checkTypes = row => {
  for (const key of Object.keys(row)) {
    if (key === 'durationMinutes') {
      row[key] = parseInt(row[key]);
    }
  }

  return row;
};

export default class DB {
  private pool: Pool;
  private connection?: Connection;

  constructor() {
    if (CLEARDB_DATABASE_URL) {
      this.pool = createPool(CLEARDB_DATABASE_URL as PoolOptions);
    } else {
      this.pool = createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWD,
        database: NODE_ENV == 'test' ? DB_NAME_TEST : DB_NAME,
      });
    }
  }

  async init() {
    this.connection = await this.pool.getConnection();
    return true;
  }

  async query(sql) {
    const [results] = await this.pool.query(sql);

    return (results as []).map(checkTypes);
  }

  async queryOne(sql) {
    const [results] = await this.pool.query(sql);
    return (results as []).length > 0 ? checkTypes(results[0]) : false;
  }

  async execute(sql, data) {
    const [results] = await this.pool.execute(sql, data);
    const { insertId } = results as any;
    return insertId ? insertId : false;
  }
}
