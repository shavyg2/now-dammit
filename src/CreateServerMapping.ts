import path from "path";
import getport from "get-port-sync";
import { ServerMapping } from "./ServerMapping";
import { DammitConfig } from "./DammitConfig";
import { SpawnServer } from "./SpawnServer";

export function CreateServerMapping(root,config: DammitConfig): ServerMapping[] {
    return config.servers.map(server => {
        let applicationDirectory = path.join(root, server.path);
        let port = getport();
        let url = `http://localhost:${port}`;
        let thread = SpawnServer(server, applicationDirectory, port);
        process.on("beforeExit", () => {
            if (thread.killed)
                thread.kill();
        });
        return {
            applicationDirectory,
            port,
            url
        };
    });
}
