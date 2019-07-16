import { ServerOptions } from "./ServerOptions";
import { SharedLib } from "./SharedLib";



export interface WatchCommand{
    path:string;
    test:string;
    command:string;
    cwd?:string;
    throttle?:number
}
export interface DammitConfig {
    $schema?:string
    port: number;
    servers: ServerOptions[];
    rewrite: string[];
    common?:SharedLib;
    watch?:WatchCommand[]
}


