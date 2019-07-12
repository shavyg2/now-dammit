"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var shell = __importStar(require("shell-quote"));
var child = __importStar(require("child_process"));
function SpawnServer(server, applicationDirectory, port) {
    var _a = shell.parse(server.cmd), command = _a[0], args = _a.slice(1);
    var thread = child.spawn(command, args, {
        cwd: applicationDirectory,
        stdio: "inherit",
        shell: true,
        env: {
            port: port
        }
    });
    process.on('beforeExit', function () {
        if (!thread.killed) {
            thread.kill();
        }
    });
    process.on('exit', function () {
        if (!thread.killed) {
            thread.kill();
        }
    });
    process.on('disconnect', function () {
        if (!thread.killed) {
            thread.kill();
        }
    });
    thread.on("exit", function (code) {
        process.exit(code);
    });
    thread.on("beforeExit", function (code) {
        process.exit(code);
    });
    return thread;
}
exports.SpawnServer = SpawnServer;
