import { Collector, Metric, Registry } from "../metrics";

declare class CollectorImpl extends Collector {
    readonly name: string;
    readonly metrics: Metric[];

    protected updateMetrics(registry: Registry): void;
}

export const MemoryCollector: typeof CollectorImpl;
export const OSCollector: typeof CollectorImpl;
export const TimeCollector: typeof CollectorImpl;
