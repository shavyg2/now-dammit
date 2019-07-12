"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_forward_1 = __importDefault(require("http-forward"));
function RedirectToServer(url, result, serverInstance, req, next, res) {
    var rewrittenPath = url.replace(result.test, result.redirect).replace(/\/{2,}/g, "/");
    var target = serverInstance.url;
    req.url = rewrittenPath;
    req["forward"] = { target: target };
    http_forward_1.default(req, res);
}
exports.RedirectToServer = RedirectToServer;
