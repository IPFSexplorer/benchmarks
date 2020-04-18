import Benchmark from "benchmark";
import User from "./User";
import mysql from "./mysql";
import postgres, { DB_NAME } from "./postgres";

const suite = new Benchmark.Suite("insert", {
    async: false,
});

// add tests
suite
    .add(
        "insert explorer-core",
        async function(deferrer) {
            const u = new User();
            u.name = "test";
            u.age = 10;
            await u.save();
            deferrer.resolve();
        },
        {
            defer: true,
        },
    )
    .add(
        "insert mysql",
        async function (deferrer) {
            await new Promise((resolve) => {
                mysql.query("INSERT INTO User (name, age) VALUES ('John', 5)", (error, results, fields) => {
                    if (error) throw error;
                    resolve();
                });
            });
            deferrer.resolve();
        },
        {
            defer: true,
        },
    )
    .add(
        "insert postgres",
        async function(deferrer) {
            await (await postgres)`INSERT INTO "${(await postgres)(DB_NAME)}.Users" (name, age) VALUES ('John', 5)`;
            deferrer.resolve();
        },
        {
            defer: true,
        },
    );

export default suite;
