import path from "path";
import getport from "get-port-sync";
import { ServerMapping } from "./ServerMapping";
import { DammitConfig } from "./DammitConfig";
import { RedirectToServer } from "./RedirectToServer";
import { CreateServerMappingTest } from "./CreateServerMappingTest";
import { BootLibCopy } from "./BootLibCopy";

export function BootServer(root:string, app, config: DammitConfig, refs: ServerMapping[]) {
    
    let rules = config.rewrite.map(rule => {
        return CreateServerMappingTest(rule);
    });


    

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

