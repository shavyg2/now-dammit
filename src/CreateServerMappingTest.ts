import regexParser from "regex-parser";
import { ServerMappingTest } from "./ServerMappingTest";
export function CreateServerMappingTest(rule: string) {
    let [regex, url, folder] = rule.split(" ");
    let test = regexParser(regex);
    return { test, redirect: url, folder } as ServerMappingTest;
}
