"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var shell = __importStar(require("shell-quote"));
var child = __importStar(require("child_process"));
var is_windows_1 = __importDefault(require("is-windows"));
var chokidar_1 = __importDefault(require("chokidar"));
var regex_parser_1 = __importDefault(require("regex-parser"));
var portscanner_1 = __importDefault(require("portscanner"));
var util_1 = __importDefault(require("util"));
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function SpawnServer(server, applicationDirectory, port, threadRef) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, command, args, status, thread;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = shell.parse(server.cmd), command = _a[0], args = _a.slice(1);
                    status = "open";
                    if (threadRef.thread && !threadRef.thread.killed) {
                        threadRef.thread.kill("SIGINT");
                    }
                    _b.label = 1;
                case 1:
                    if (!(status === 'open')) return [3 /*break*/, 4];
                    return [4 /*yield*/, util_1.default.promisify(portscanner_1.default.checkPortStatus.bind(portscanner_1.default))(port, '127.0.0.1')];
                case 2:
                    status = _b.sent();
                    console.log(status);
                    if (status === "closed") {
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, new Promise(function (r) {
                            setTimeout(r, 5000);
                        })];
                case 3:
                    _b.sent();
                    console.log("waiting for port " + port);
                    return [3 /*break*/, 1];
                case 4:
                    thread = threadRef.thread = child.spawn(command, args, {
                        cwd: applicationDirectory,
                        stdio: "inherit",
                        shell: is_windows_1.default(),
                        env: Object.assign({}, process.env, {
                            port: port,
                            Port: port,
                            PORT: port
                        })
                    });
                    if (server.watch) {
                        server.watch.forEach(function (watch) {
                            var watcher = chokidar_1.default.watch(watch.path, {
                                ignoreInitial: true,
                                alwaysStat: false,
                                awaitWriteFinish: true
                            });
                            thread.on("exit", function () {
                                watcher.removeAllListeners();
                                watcher.close();
                            });
                            var test = regex_parser_1.default(watch.test);
                            rxjs_1.fromEvent(watcher, "change").pipe(operators_1.debounceTime(5000)).subscribe(function (file) {
                                if (test.test(file)) {
                                    thread.kill();
                                    SpawnServer(server, applicationDirectory, port, threadRef);
                                }
                            });
                        });
                    }
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
                    thread.on("error", function (error) {
                        console.log(error);
                        process.exit(1);
                    });
                    return [2 /*return*/, { thread: thread }];
            }
        });
    });
}
exports.SpawnServer = SpawnServer;
