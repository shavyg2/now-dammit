import * as shell from "shell-quote";
import * as child from "child_process";
import { ServerOptions } from "./ServerOptions";
export function SpawnServer(server: ServerOptions, applicationDirectory: string, port: any) {
    let [command, ...args] = shell.parse(server.cmd) as string[];
    let thread = child.spawn(command, args, {
        cwd: applicationDirectory,
        stdio: "inherit",
        shell: true,
        env: {
            port
        }
    });

    process.on('beforeExit',()=>{
        if(!thread.killed){
            thread.kill();
        }
    })

    process.on('exit',()=>{
        if(!thread.killed){
            thread.kill();
        }
    })
    process.on('disconnect',()=>{
        if(!thread.killed){
            thread.kill();
        }
    })

    thread.on("exit",(code)=>{
        process.exit(code);
    })
    thread.on("beforeExit",(code)=>{
        process.exit(code);
    })
    return thread;
}
