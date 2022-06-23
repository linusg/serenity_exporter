export declare class Registry {
    constructor(namespace: string);

    // Value typed as intersection of all `Metric` subclasses so that
    // `metrics["name"]` isn't typed too strictly.
    metrics: Record<string, Counter & Gauge & Info>;
    collectors: Record<string, Collector>;

    get hasMetrics(): boolean;
    get hasCollectors(): boolean;

    addMetric(metric: Metric): void;
    addCollector(collector: Collector): void;
    toString(): string;
}

export declare abstract class Collector {
    constructor();

    abstract readonly name: string;
    abstract readonly metrics: Metric[];

    collect(registry: Registry): void;
    protected abstract updateMetrics(registry: Registry): void;
}

type MetricType = "counter" | "gauge" | "info";

type MetricOptions = {
    name: string;
    help?: string;
};

type MetricLabels = { [name: string]: string };

type MetricValue = {
    value: number;
    labels?: MetricLabels;
};

declare class Metric {
    constructor(options: MetricOptions & { type: MetricType });

    name: string;
    help?: string;
    type: MetricType;
    values: MetricValue[];

    addMetric(metric: Metric): void;
    toStringWithNamespace(namespace: string): string;
}

export declare class Counter extends Metric {
    constructor(options: MetricOptions);

    set(value: number, labels?: MetricLabels): void;
}

export declare class Gauge extends Metric {
    constructor(options: MetricOptions);

    set(value: number, labels?: MetricLabels): void;
}

export declare class Info extends Metric {
    constructor(options: MetricOptions);

    set(labels: MetricLabels): void;
}
