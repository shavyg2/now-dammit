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
        var port = get_port_sync_1.default();
        var url = "http://localhost:" + port;
        var thread = SpawnServer_1.SpawnServer(server, applicationDirectory, port);
        process.on("beforeExit", function () {
            if (thread.killed)
                thread.kill();
        });
        return {
            applicationDirectory: applicationDirectory,
            port: port,
            url: url
        };
    });
}
exports.CreateServerMapping = CreateServerMapping;
