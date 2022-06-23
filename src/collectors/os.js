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
        const {
            Version: { Major: major, Minor: minor, Git: git },
        } = loadINI("/res/version.ini");
        const version = `${major}.${minor}.${git}`;
        registry.metrics["os_info"].set({ version });
    }
}
