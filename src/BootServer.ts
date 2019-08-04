import path from "path";
import getport from "get-port-sync";
import { ServerMapping } from "./ServerMapping";
import { DammitConfig } from "./DammitConfig";
import { RedirectToServer } from "./RedirectToServer";
import { CreateServerMappingTest } from "./CreateServerMappingTest";
import { BootLibCopy } from "./BootLibCopy";
import {debounceTime} from "rxjs/operators";
import {fromEvent} from "rxjs";
import chokidar from "chokidar";
import toRegex from "regex-parser";
import * as quote from "shell-quote";
import isWindow from "is-windows";
import { spawn, ChildProcess } from "child_process";
export function BootServer(root:string, app, config: DammitConfig, refs: ServerMapping[]) {
    
    let rules = (config.rewrite||[]).map(rule => {
        return CreateServerMappingTest(rule);
    });



    if(config.watch){
        const watchers = config.watch;

        watchers.forEach(watch=>{

            let thread:ChildProcess;
            let watcher = chokidar.watch(watch.path,{
                ignoreInitial:true,
                alwaysStat:false,
            })

            const test = toRegex(watch.test || ".*");
            fromEvent(watcher,"change")

            .pipe(
                debounceTime(watch.throttle || 3000)
            ).subscribe((file:string)=>{


                if(test.test(file)){
                  let [command,...args] = quote.parse(watch.command) as string[];
                   
                  if(thread && !thread.killed){
                    thread.kill();
                  }

                  spawn(command,args,{
                       stdio:"inherit",
                       shell:isWindow(),
                       cwd:watch.cwd
                   })
                }
            })


            

        })
    }


    

    app.all("*", function (req, res, next) {
        let url = req.url;
        let [result] = rules.filter(rule => rule.test.test(url));

        if(!result){
            return next(new Error("No Mapping found"))
        }
        let [serverInstance] = refs.filter(ref => ref.applicationDirectory == path.join(root, result ? result.folder : ''));
        if (!result || !serverInstance) {
            return next();
        }
        else {
            RedirectToServer(url, result, serverInstance, req, next, res);
        }
    });



    const server = app.listen(process.env.port || config.port || getport(), () => {
        console.log(`server running on http://localhost:${server.address().port}`);
        refs.forEach(ref=>{
            console.log(`${ref.applicationDirectory}: ${ref.url}`);
        })
    });
}

