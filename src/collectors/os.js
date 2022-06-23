import { Collector, Info } from "../metrics.js";

export class OSCollector extends Collector {
    name = "os";

    metrics = [
        new Info({
            name: "os_info",
            help: "OS version information.",
        }),
    ];

    updateMetrics(registry) {
        const versionParts = loadINI("/res/version.ini");
        const version = `${versionParts["Version"]["Major"]}.${versionParts["Version"]["Minor"]}.${versionParts["Version"]["Git"]}`;
        registry.metrics["os_info"].set({ version });
    }
}
