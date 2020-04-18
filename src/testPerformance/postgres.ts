import { config } from "dotenv";
import postgres from "postgres";
import { RunAsync } from "../helpers";
import Benchmark from "benchmark";
config();

const sql = postgres(
    "postgres://" +
        process.env.postgresUser +
        ":" +
        process.env.postgresPassword +
        "@" +
        process.env.postgresHost +
        ":" +
        process.env.postgresPort +
        "/" +
        process.env.postgresDatabase,
);

const suite = new Benchmark.Suite("postgres", {
    async: false,
}).add(
    "postgres",
    async function(deferrer) {
        await sql`
            SELECT * FROM authors JOIN posts ON posts.author_id=authors.id  WHERE authors.id=${sql(
                Math.floor(Math.random() * 1001) + 1,
            )} ;`;
        deferrer.resolve();
    },
    {
        defer: true,
    },
);

(async () => {
    while (true) {
        await RunAsync(suite);
    }
})();
