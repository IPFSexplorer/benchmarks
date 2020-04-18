import postgres from "postgres";

const sql = postgres("postgres://postgres:404363289@server.local:15432/postgres");

export const DB_NAME = "testDB_" + new Date().getTime().toString();

export default (async () => {
    await sql`CREATE SCHEMA "${sql(DB_NAME)}";`;
    await sql`CREATE TABLE  "${sql(DB_NAME)}.Users" (
        name VARCHAR(30)  NOT NULL,
        age integer NOT NULL
    );`;
    await sql`CREATE INDEX ${sql(DB_NAME + "_age_idx")} ON  "${sql(DB_NAME)}.Users" (age);`;
    await sql` CREATE INDEX ${sql(DB_NAME + "_name_idx")} ON  "${sql(DB_NAME)}.Users" (name);`;
    return sql;
})();
