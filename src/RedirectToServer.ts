import forward from "http-forward";
import { ServerMapping } from "./ServerMapping";
import { ServerMappingTest } from "./ServerMappingTest";
export function RedirectToServer(url: any, result: ServerMappingTest, serverInstance: ServerMapping, req: any, next: any, res: any) {
    let rewrittenPath = url.replace(result.test, result.redirect).replace(/\/{2,}/g, "/");
    let target = serverInstance.url;
    req.url = rewrittenPath;
    req["forward"] = { target };
    forward(req, res);
}
