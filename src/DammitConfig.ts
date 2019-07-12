import { ServerOptions } from "./ServerOptions";
import { SharedLib } from "./SharedLib";
export interface DammitConfig {
    $schema?:string
    port: number;
    servers: ServerOptions[];
    rewrite: string[];
    common?:SharedLib
}


