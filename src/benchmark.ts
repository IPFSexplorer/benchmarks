import IPFSconnector from "explorer-core/src/ipfs/IPFSConnector";
import Database from "explorer-core/src/database/DAL/database/databaseStore";
import IdentityProvider from "orbit-db-identity-provider";
import User from "./suites/db/User";
import Protector from "libp2p-pnet";
import insert from "./suites/db/insert";
import { logger, RunAsync } from "./helpers";
import createBulkInsertSuite from "./suites/db/insertBulk";
(async () => {
    IPFSconnector.setConfig({
        repo: "dist/test/" + new Date().getTime().toString(),
        config: {
            Addresses: {
                Swarm: [
                    "/dns4/kancel.mucka.sk/tcp/19091/ws/p2p-webrtc-star",
                    "/dns4/kancel.mucka.sk/tcp/19090/ws/p2p-websocket-star",
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

    const id = (await (await IPFSconnector.getInstanceAsync()).node.id()).id;
    const identity = await IdentityProvider.createIdentity({
        id: new Date().getTime().toString(),
    });

    let DbName = new Date().getTime().toString();

    Database.connect("testDB" + DbName, identity);
    Database.select("testDB" + DbName);
    Database.selectedDatabase.getOrCreateTableByEntity(new User());

    await RunAsync(insert);
    for (const bulkSize of [10, 50, 100, 200, 500, 1000]) {
        DbName = new Date().getTime().toString();
        Database.connect("testDB" + DbName, identity);
        Database.select("testDB" + DbName);
        Database.selectedDatabase.getOrCreateTableByEntity(new User());
        await RunAsync(createBulkInsertSuite(bulkSize));
    }
})();
