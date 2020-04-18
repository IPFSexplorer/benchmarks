import { config } from "dotenv";
import mysql from "mysql";
import { RunAsync } from "../helpers";
import Benchmark from "benchmark";
config();

const connection = mysql.createConnection({
    port: process.env.mysqlPort,
    host: process.env.mysqlHost,
    user: process.env.mysqlUser,
    password: process.env.mysqlPassword,
    database: process.env.mysqlDatabase,
});

const suite = new Benchmark.Suite("mysql", {
    async: false,
}).add(
    "mysql",
    async function(deferrer) {
        connection.query(
            "SELECT * FROM authors JOIN posts ON posts.author_id=authors.id  WHERE authors.id=" +
                (Math.floor(Math.random() * 1001) + 1) +
                " ;",
            (error, results, fields) => {
                if (error) throw error;
                deferrer.resolve();
            },
        );
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
