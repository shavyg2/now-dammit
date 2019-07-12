"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var regex_parser_1 = __importDefault(require("regex-parser"));
function CreateServerMappingTest(rule) {
    var _a = rule.split(" "), regex = _a[0], url = _a[1], folder = _a[2];
    var test = regex_parser_1.default(regex);
    return { test: test, redirect: url, folder: folder };
}
exports.CreateServerMappingTest = CreateServerMappingTest;
