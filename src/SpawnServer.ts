import * as shell from "shell-quote";
import * as child from "child_process";
import { ServerOptions } from "./ServerOptions";
import isWindows from "is-windows";
import chokidar from "chokidar";
import toRegex from "regex-parser";
import waitForPort from "portscanner";
import util from "util";
import {fromEvent} from "rxjs";
import {debounceTime} from "rxjs/operators"

export async function SpawnServer(server: ServerOptions, applicationDirectory: string, port: any,threadRef:{thread:child.ChildProcess}) {

    let [command, ...args] = shell.parse(server.cmd) as string[];
    let status = "open";

    if(threadRef.thread && !threadRef.thread.killed){
        threadRef.thread.kill("SIGINT");
    }
    while(status==='open'){
        status = await util.promisify(waitForPort.checkPortStatus.bind(waitForPort))(port,'127.0.0.1')
        console.log(status);
        if(status==="closed"){
            break;
        }
        await new Promise(r=>{
            setTimeout(r,5000);
        })
        console.log(`waiting for port ${port}`);
    }
    let thread = threadRef.thread = child.spawn(command, args, {
        cwd: applicationDirectory,
        stdio: "inherit",
        shell: isWindows(),
        env: Object.assign({},process.env,{
            port,
            Port:port,
            PORT:port
        })
    });

    if(server.watch){
        server.watch.forEach(watch=>{

            const watcher = chokidar.watch(watch.path,{
                ignoreInitial:true,
                alwaysStat:false,
                awaitWriteFinish:true
            })

            thread.on("exit",()=>{
                watcher.removeAllListeners();
                watcher.close();
            })
            const test = toRegex(watch.test);
            fromEvent(watcher,"change").pipe(

                debounceTime(5000)
            ).subscribe((file:string)=>{
                if(test.test(file)){
                    thread.kill();
                    SpawnServer(server,applicationDirectory,port,threadRef);
                }
            })
        })
    }

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


    thread.on("error",(error)=>{
        console.log(error);
        process.exit(1);
    })


    return {thread};
}
