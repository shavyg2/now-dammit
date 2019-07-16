import path from "path";
import getport from "get-port-sync";
import { ServerMapping } from "./ServerMapping";
import { DammitConfig } from "./DammitConfig";
import { SpawnServer } from "./SpawnServer";
import { ChildProcess } from "child_process";

export  function CreateServerMapping(
  root,
  config: DammitConfig
): ServerMapping[] {
  return config.servers.map(server => {
    let applicationDirectory = path.join(root, server.path);
    let port = server.port || getport();
    let url = `http://localhost:${port}`;

    let threadRef:{thread:ChildProcess} = {thread:null} as any ;

    SpawnServer(server, applicationDirectory, port,threadRef);
    const killProcess = (code=0) => {
      if (!threadRef.thread.killed) {
        threadRef.thread.kill()
      }
    };


    

    process.on("beforeExit", killProcess);
    return {
      applicationDirectory,
      port,
      url
    };
  });
}
