"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var get_port_sync_1 = __importDefault(require("get-port-sync"));
var SpawnServer_1 = require("./SpawnServer");
function CreateServerMapping(root, config) {
    return config.servers.map(function (server) {
        var applicationDirectory = path_1.default.join(root, server.path);
        var port = server.port || get_port_sync_1.default();
        var url = "http://localhost:" + port;
        var threadRef = { thread: null };
        SpawnServer_1.SpawnServer(server, applicationDirectory, port, threadRef);
        var killProcess = function (code) {
            if (code === void 0) { code = 0; }
            if (!threadRef.thread.killed) {
                threadRef.thread.kill();
            }
        };
        process.on("beforeExit", killProcess);
        return {
            applicationDirectory: applicationDirectory,
            port: port,
            url: url
        };
    });
}
exports.CreateServerMapping = CreateServerMapping;
