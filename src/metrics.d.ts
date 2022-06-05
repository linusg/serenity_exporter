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

export declare class Metrics {
    constructor(namespace: string);

    addMetric(metric: Metric): void;
    toString(): string;
}

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
