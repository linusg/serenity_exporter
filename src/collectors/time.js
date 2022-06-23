import { Collector, Counter, Gauge } from "../metrics.js";

export class TimeCollector extends Collector {
    name = "time";

    metrics = [
        new Gauge({
            name: "time_seconds",
            help: "The system's epoch time in seconds.",
        }),
        new Counter({
            name: "time_uptime_seconds_total",
            help: "The system's uptime in seconds.",
        }),
    ];

    updateMetrics(registry) {
        const uptime = loadJSON("/proc/uptime");
        const epochTime = Date.now() / 1000;
        registry.metrics["time_seconds"].set(epochTime);
        registry.metrics["time_uptime_seconds_total"].set(uptime);
    }
}
