import { WatchConfig } from "./WatchConfig";

export interface ServerOptions {
    path: string;
    cmd: string;
    port?:number;

    watch?:WatchConfig[];
}
