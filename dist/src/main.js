"use strict";
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
var pkg = __importStar(require("pkg-dir"));
var path_1 = __importDefault(require("path"));
var express_1 = __importDefault(require("express"));
var BootServer_1 = require("./BootServer");
var CreateServerMapping_1 = require("./CreateServerMapping");
var BootLibCopy_1 = require("./BootLibCopy");
function Main() {
    var root = pkg.sync();
    var dammitPath = path_1.default.join(root, "dammit.json");
    var config = require(dammitPath);
    var serverMapping = CreateServerMapping_1.CreateServerMapping(root, config);
    BootLibCopy_1.BootLibCopy(config);
    var app = express_1.default();
    BootServer_1.BootServer(root, app, config, serverMapping);
}
exports.Main = Main;
