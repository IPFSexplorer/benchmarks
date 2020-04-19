import { config } from "dotenv";
import { RunAsync } from "../helpers";
import Benchmark from "benchmark";
import Database from "explorer-core/src/database/DAL/database/databaseStore";
import IdentityProvider from "orbit-db-identity-provider";
import Author from "./explorer/Author";
import Keystore from "orbit-db-keystore";
import { delay } from "explorer-core/src/common";
import IPFSconnector from "explorer-core/src/ipfs/IPFSConnector";
import Protector from "libp2p-pnet";
import getPort from "get-port";
config();

(async () => {
    IPFSconnector.setConfig({
        repo: "explorer2",
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/" + (await getPort()),
                    "/dns4/server.local/tcp/19091/ws/p2p-webrtc-star",
                    "/dns4/server.local/tcp/19090/ws/p2p-websocket-star",
                ],
            },
        },
        libp2p: {
            modules: {
                connProtector: new Protector(`/key/swarm/psk/1.0.0/
/base16/
30734f1804abb36a803d0e9f1a31ffe5851b6df1445bf23f96fd3fe8fbc9e793`),
            },
            config: {
                pubsub: {
                    emitSelf: false,
                },
            },
        },
    });
    const keystore = new Keystore("keystoreee");
    const identity = await IdentityProvider.createIdentity({
        id: new Date().getTime().toString(),
        keystore,
    });

    Database.connect("performance", identity);
    Database.select("performance");
    while (true) {
        const suite = new Benchmark.Suite("explorer", {
            async: false,
        }).add(
            "explorer",
            async function(deferrer) {
                try {
                    await await new Author()
                        .where("id")
                        .equal(Math.floor(Math.random() * 1001) + 1)
                        .first();
                } catch (ex) {
                    console.log("not yet sync");
                    await delay(2000);
                } finally {
                    deferrer.resolve();
                }
            },
            {
                defer: true,
            },
        );
        await RunAsync(suite);
        await Database.selectedDatabase.waitForAllTransactionsDone();
    }
})();
