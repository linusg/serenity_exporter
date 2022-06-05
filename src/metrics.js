export class Metrics {
    addMetric(metric) {
        this[metric.name] = metric;
    }

    toString() {
        return Object.getOwnPropertyNames(this)
            .map(name => this[name])
            .map(metric => metric.toString())
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

    toString() {
        const lines = [];
        lines.push(`# TYPE ${this.name} ${this.type}`);
        if (this.help) {
            lines.push(`# HELP ${this.name} ${this.help}`);
        }
        for (const { value, labels } of this.values) {
            if (!labels || Object.keys(labels).length === 0) {
                lines.push(`${this.name} ${value}`);
            } else {
                const joinedLabels = Object.entries(labels)
                    .map(([key, value]) => `${key}="${value}"`)
                    .join(",");
                lines.push(`${this.name}{${joinedLabels}} ${value}`);
            }
        }
        return lines.join("\n");
    }
}

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

export class Gauge extends Metric {
    constructor(options) {
        super({ ...options, type: "gauge" });
    }

    set(value, labels) {
        this.values.push({ value, labels });
    }
}

export class Info extends Metric {
    constructor(options) {
        super({ ...options, type: "info" });
    }

    set(labels) {
        this.values.push({ value: 1, labels });
    }
}
