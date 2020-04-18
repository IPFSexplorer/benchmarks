import Benchmark from "benchmark";
import User from "./User";
import mysql from "./mysql";
import postgres, { DB_NAME } from "./postgres";

function createBulkInsertSuite(bulkSize) {
    const suite = new Benchmark.Suite("insert bulk size " + bulkSize, {
        async: false,
    });

    // add tests
    suite
        .add(
            "insert bulk " + bulkSize + " explorer-core",
            async function(deferrer) {
                const tasks = [];
                for (let i = 0; i < bulkSize; i++) {
                    const u = new User();
                    u.name = "test" + i;
                    u.age = i;
                    tasks.push(u.save());
                }
                await Promise.all(tasks);
                deferrer.resolve();
            },
            {
                defer: true,
            },
        )
        .add(
            "insert bulk  " + bulkSize + "  mysql",
            async function(deferrer) {
                const tasks = [];
                for (let i = 0; i < bulkSize; i++) {
                    tasks.push(
                        new Promise(resolve => {
                            mysql.query("INSERT INTO User (name, age) VALUES ('John', 5)", (error, results, fields) => {
                                if (error) throw error;
                                resolve();
                            });
                        }),
                    );
                }
                await Promise.all(tasks);
                deferrer.resolve();
            },
            {
                defer: true,
            },
        )
        .add(
            "insert bulk  " + bulkSize + "  postgres",
            async function(deferrer) {
                const tasks = [];
                for (let i = 0; i < bulkSize; i++) {
                    tasks.push(
                        (await postgres)`INSERT INTO "${(await postgres)(
                            DB_NAME,
                        )}.Users" (name, age) VALUES ('John', 5)`,
                    );
                }
                await Promise.all(tasks);
                deferrer.resolve();
            },
            {
                defer: true,
            },
        );
    return suite;
}

export default createBulkInsertSuite;
