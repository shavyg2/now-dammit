import * as pkg from "pkg-dir";
import path from "path";
import  express from "express";
import { DammitConfig } from "./DammitConfig";
import { BootServer } from "./BootServer";
import { CreateServerMapping } from "./CreateServerMapping";
import { BootLibCopy } from "./BootLibCopy";

export function Main(){
    let root = pkg.sync();
    let dammitPath = path.join(root,"dammit.json");
    let config:DammitConfig = require(dammitPath)
    let serverMapping = CreateServerMapping(root,config);

    BootLibCopy(config);
    let app = express();

    BootServer(root,app, config,serverMapping);
}
