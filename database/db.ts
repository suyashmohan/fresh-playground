import {
  Generated,
  Kysely,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from "kysely";

import { SqliteDriver } from "./sqlite_driver.ts";

interface User {
  id: Generated<number>;
  email: string;
  password: string;
}

export interface Database {
  user: User;
}

export class DB {
  static #instance: Kysely<Database>;

  private constructor() {}

  public static getInstance(): Kysely<Database> {
    if (!DB.#instance) {
      DB.#instance = DB.#initDB();
    }

    return DB.#instance;
  }

  static #initDB() {
    return new Kysely<Database>({
      dialect: {
        createAdapter() {
          return new SqliteAdapter();
        },
        createDriver() {
          return new SqliteDriver("db.sqlite");
        },
        createIntrospector(db: Kysely<unknown>) {
          return new SqliteIntrospector(db);
        },
        createQueryCompiler() {
          return new SqliteQueryCompiler();
        },
      },
    });
  }
}
