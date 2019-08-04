"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var get_port_sync_1 = __importDefault(require("get-port-sync"));
var RedirectToServer_1 = require("./RedirectToServer");
var CreateServerMappingTest_1 = require("./CreateServerMappingTest");
var operators_1 = require("rxjs/operators");
var rxjs_1 = require("rxjs");
var chokidar_1 = __importDefault(require("chokidar"));
var regex_parser_1 = __importDefault(require("regex-parser"));
var quote = __importStar(require("shell-quote"));
var is_windows_1 = __importDefault(require("is-windows"));
var child_process_1 = require("child_process");
function BootServer(root, app, config, refs) {
    var rules = (config.rewrite || []).map(function (rule) {
        return CreateServerMappingTest_1.CreateServerMappingTest(rule);
    });
    if (config.watch) {
        var watchers = config.watch;
        watchers.forEach(function (watch) {
            var thread;
            var watcher = chokidar_1.default.watch(watch.path, {
                ignoreInitial: true,
                alwaysStat: false,
            });
            var test = regex_parser_1.default(watch.test || ".*");
            rxjs_1.fromEvent(watcher, "change")
                .pipe(operators_1.debounceTime(watch.throttle || 3000)).subscribe(function (file) {
                if (test.test(file)) {
                    var _a = quote.parse(watch.command), command = _a[0], args = _a.slice(1);
                    if (thread && !thread.killed) {
                        thread.kill();
                    }
                    child_process_1.spawn(command, args, {
                        stdio: "inherit",
                        shell: is_windows_1.default(),
                        cwd: watch.cwd
                    });
                }
            });
        });
    }
    app.all("*", function (req, res, next) {
        var url = req.url;
        var result = rules.filter(function (rule) { return rule.test.test(url); })[0];
        if (!result) {
            return next(new Error("No Mapping found"));
        }
        var serverInstance = refs.filter(function (ref) { return ref.applicationDirectory == path_1.default.join(root, result ? result.folder : ''); })[0];
        if (!result || !serverInstance) {
            return next();
        }
        else {
            RedirectToServer_1.RedirectToServer(url, result, serverInstance, req, next, res);
        }
    });
    var server = app.listen(process.env.port || config.port || get_port_sync_1.default(), function () {
        console.log("server running on http://localhost:" + server.address().port);
        refs.forEach(function (ref) {
            console.log(ref.applicationDirectory + ": " + ref.url);
        });
    });
}
exports.BootServer = BootServer;
