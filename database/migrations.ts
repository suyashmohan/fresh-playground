import { Kysely } from "kysely";
import { Database, DB } from "./db.ts";

async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable("user")
    .ifNotExists()
    .addColumn("id", "integer", (col) => col.autoIncrement().primaryKey())
    .addColumn("email", "text", (col) => col.notNull())
    .addColumn("password", "text", (col) => col.notNull())
    .execute();

  await db.insertInto("user").values({
    email: "test@test.com",
    password: "123123",
  }).execute();
}

async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable("user").ifExists().execute();
}

async function run() {
  const db = DB.getInstance();
  await down(db);
  await up(db);
}

if (import.meta.main) {
  run();
}
