export class Metrics {
    constructor(namespace) {
        this.namespace = namespace;
        this.metricNames = [];
    }

    addMetric(metric) {
        this.metricNames.push(metric.name);
        this[metric.name] = metric;
    }

    toString() {
        return this.metricNames
            .map(name => this[name])
            .map(metric => metric.toStringWithNamespace(this.namespace))
            .join("\n\n");
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
        super({ ...options, type: "info" });
    }

    set(labels) {
        this.values.push({ value: 1, labels });
    }
}
