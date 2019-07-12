"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var libCopy_1 = __importDefault(require("./libCopy"));
function BootLibCopy(config) {
    if (config.common) {
        var source_1 = config.common.lib;
        config.common.lib.forEach(function (dest) {
            libCopy_1.default(source_1, dest, { watch: true });
        });
    }
}
exports.BootLibCopy = BootLibCopy;
