// Based on https://github.com/koskimas/kysely/blob/master/src/dialect/sqlite/sqlite-driver.ts
// and https://github.com/michalvavra/fresh-sqlite-example/blob/main/utils/sqlite_driver.ts

import { DB as SqliteDatabase, QueryParameterSet } from "sqlite";
import { CompiledQuery, DatabaseConnection, Driver, QueryResult } from "kysely";

export class SqliteDriver implements Driver {
  readonly #connectionMutex = new ConnectionMutex();

  #db?: SqliteDatabase;
  #connection?: DatabaseConnection;
  path?: string;

  constructor(path: string) {
    this.path = path;
  }

  init(): Promise<void> {
    this.#db = new SqliteDatabase(this.path);
    this.#connection = new SqliteConnection(this.#db);
    return Promise.resolve();
  }

  async acquireConnection(): Promise<DatabaseConnection> {
    // SQLite only has one single connection. We use a mutex here to wait
    // until the single connection has been released.
    await this.#connectionMutex.lock();
    return this.#connection!;
  }

  async beginTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }

  async commitTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }

  async rollbackTransaction(connection: DatabaseConnection): Promise<void> {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }

  releaseConnection(): Promise<void> {
    this.#connectionMutex.unlock();
    return Promise.resolve();
  }

  destroy(): Promise<void> {
    this.#db?.close();
    return Promise.resolve();
  }
}

class SqliteConnection implements DatabaseConnection {
  readonly #db: SqliteDatabase;

  constructor(db: SqliteDatabase) {
    this.#db = db;
  }

  executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    const { sql, parameters } = compiledQuery;
    const stmt = this.#db.prepareQuery(sql);

    return Promise.resolve({
      rows: stmt.allEntries(parameters as QueryParameterSet) as unknown as O[],
    });
  }

  async *streamQuery<R>(): AsyncIterableIterator<QueryResult<R>> {
    // throw new Error("Sqlite driver doesn't support streaming")
  }
}

class ConnectionMutex {
  #promise?: Promise<void>;
  #resolve?: () => void;

  async lock(): Promise<void> {
    while (this.#promise) {
      await this.#promise;
    }

    this.#promise = new Promise((resolve) => {
      this.#resolve = resolve;
    });
  }

  unlock(): void {
    const resolve = this.#resolve;

    this.#promise = undefined;
    this.#resolve = undefined;

    resolve?.();
  }
}
