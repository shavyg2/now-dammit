import { DammitConfig } from "./DammitConfig";
import libCopy from "./libCopy";
export function BootLibCopy(config: DammitConfig) {
    if (config.common) {
        let source = config.common.lib;
        config.common.lib.forEach(dest => {
            libCopy(source, dest, { watch: true });
        });
    }
}
