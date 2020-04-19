import IdentityProvider from "orbit-db-identity-provider";
import DatabaseInstance from "explorer-core/src/database/DAL/database/databaseInstance";
import PubSubMessage from "explorer-core/src/database/DAL/database/PubSub/pubSubMessage";
import { PubSubMessageType } from "explorer-core/src/database/DAL/database/PubSub/MessageType";
import { delay } from "explorer-core/src/common";
import IPFSconnector from "explorer-core/src/ipfs/IPFSConnector";
import Database from "explorer-core/src/database/DAL/database/databaseStore";
import Protector from "libp2p-pnet";
import { authors } from "./testDBexplorer";
import Post from "./Post";
import Author from "./Author";
import getPort from "get-port";

const dbName = process.env.explorerDatabase;
console.log(dbName);
(async () => {
    IPFSconnector.setConfig({
        repo: "explorer",
        config: {
            Addresses: {
                Swarm: [
                    "/ip4/0.0.0.0/tcp/" + (await getPort()),
                    "/ip4/127.0.0.1/tcp/" + (await getPort()) + "/ws",
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
    const id = (await (await IPFSconnector.getInstanceAsync()).node.id()).id;
    console.log(id);
    const identity = await IdentityProvider.createIdentity({
        id,
    });
    Database.connect(dbName, identity);

    await Database.use(dbName).execute(async (database: DatabaseInstance) => {
        Database.selectedDatabase.getOrCreateTableByEntity(new Author());
        Database.selectedDatabase.getOrCreateTableByEntity(new Post());

        let tasks: Promise<void>[] = [];
        for (const author of authors) {
            if (tasks.length === 100) {
                await Promise.all(tasks);
                console.log(author.id);
                tasks = [];
            }
            tasks.push(new Author(author).save());
        }

        await Promise.all(tasks);

        while (true) {
            await database.pubSubListener.publish(
                new PubSubMessage({
                    type: PubSubMessageType.PublishVersion,
                    value: (await database.log.toMultihash()).toString(),
                }),
            );
            await delay(2000);
        }
    });
})();
