export class Registry {
    constructor(namespace) {
        this.namespace = namespace;
        this.metrics = {};
        this.collectors = {};
    }

    get hasMetrics() {
        return Object.keys(this.metrics).length > 0;
    }

    get hasCollectors() {
        return Object.keys(this.collectors).length > 0;
    }

    addMetric(metric) {
        this.metrics[metric.name] = metric;
    }

    addCollector(collector) {
        if (!this.hasCollectors) {
            this.#addScrapeCollectorMetrics();
        }
        this.collectors[collector.name] = collector;
        for (const metric of collector.metrics) {
            this.addMetric(metric);
        }
    }

    toString() {
        return Object.values(this.metrics)
            .map(metric => metric.toStringWithNamespace(this.namespace))
            .join("\n\n");
    }

    #addScrapeCollectorMetrics() {
        this.addMetric(
            new Gauge({
                name: "scrape_collector_duration_seconds",
                help: "Duration of a collector scrape in seconds.",
            })
        );
        this.addMetric(
            new Gauge({
                name: "scrape_collector_success",
                help: "Whether a collector scrape succeded.",
            })
        );
    }
}

export class Collector {
    constructor() {
        this.metrics = undefined;
        this.name = undefined;
    }

    collect(registry) {
        if (registry.collectors[this.name] !== this) {
            throw new Error("Collector has not been added to registry!");
        }
        let success;
        const start = Date.now();
        try {
            this.updateMetrics(registry);
            success = true;
        } catch {
            success = false;
        }
        const end = Date.now();
        registry.metrics["scrape_collector_duration_seconds"].set((end - start) / 1000, { collector: this.name });
        registry.metrics["scrape_collector_success"].set(success ? 1 : 0, { collector: this.name });
    }

    updateMetrics(registry) {
        throw new Error("Method not implemented.");
    }
}

class Metric {
    constructor(options) {
        this.name = options.name;
        this.help = options.help;
        this.type = options.type;
        this.values = [];
    }

    toStringWithNamespace(namespace) {
        const lines = [];
        const name = `${namespace}_${this.name}`;
        lines.push(`# TYPE ${name} ${this.type}`);
        if (this.help) {
            lines.push(`# HELP ${name} ${this.help}`);
        }
        for (const { value, labels } of this.values) {
            if (!labels || Object.keys(labels).length === 0) {
                lines.push(`${name} ${value}`);
            } else {
                const joinedLabels = Object.entries(labels)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(",");
                lines.push(`${name}{${joinedLabels}} ${value}`);
            }
        }
        return lines.join("\n");
    }
}

/** https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#counter-1 */
export class Counter extends Metric {
    constructor(options) {
        if (!options.name.endsWith("_total")) {
            throw new RangeError("Counter metric name must end with '_total'");
        }
        super({ ...options, type: "counter" });
    }

    set(value, labels) {
        this.values.push({ value, labels });
    }
}

/** https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#gauge-1 */
export class Gauge extends Metric {
    constructor(options) {
        super({ ...options, type: "gauge" });
    }

    set(value, labels) {
        this.values.push({ value, labels });
    }
}

/** https://github.com/OpenObservability/OpenMetrics/blob/main/specification/OpenMetrics.md#info-1 */
export class Info extends Metric {
    constructor(options) {
        if (!options.name.endsWith("_info")) {
            throw new RangeError("Info metric name must end with '_info'");
        }
        // FIXME: Apparently Prometheus doesn't support "info".
        super({ ...options, type: "gauge" });
    }

    set(labels) {
        this.values.push({ value: 1, labels });
    }
}
