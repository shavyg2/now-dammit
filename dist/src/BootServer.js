"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var get_port_sync_1 = __importDefault(require("get-port-sync"));
var RedirectToServer_1 = require("./RedirectToServer");
var CreateServerMappingTest_1 = require("./CreateServerMappingTest");
function BootServer(root, app, config, refs) {
    var rules = config.rewrite.map(function (rule) {
        return CreateServerMappingTest_1.CreateServerMappingTest(rule);
    });
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
