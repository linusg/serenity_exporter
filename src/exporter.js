import { Counter, Gauge, Metrics } from "./metrics.js";

const PAGE_SIZE = 4096;

const metrics = new Metrics("serenity");

metrics.addMetric(
    new Gauge({
        name: "memory_kmalloc_allocated_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_kmalloc_available_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_user_physical_allocated_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_user_physical_available_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_user_physical_committed_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_user_physical_uncommitted_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_super_physical_allocated_bytes",
    })
);
metrics.addMetric(
    new Gauge({
        name: "memory_super_physical_available_bytes",
    })
);
metrics.addMetric(
    new Counter({
        name: "memory_kmalloc_call_count_total",
    })
);
metrics.addMetric(
    new Counter({
        name: "memory_kfree_call_count_total",
    })
);

// Memory
{
    const memstat = loadJSON("/proc/memstat");
    metrics["memory_kmalloc_allocated_bytes"].set(memstat.kmalloc_allocated);
    metrics["memory_kmalloc_allocated_bytes"].set(memstat.kmalloc_available);
    metrics["memory_user_physical_allocated_bytes"].set(memstat.user_physical_allocated * PAGE_SIZE);
    metrics["memory_user_physical_available_bytes"].set(memstat.user_physical_available * PAGE_SIZE);
    metrics["memory_user_physical_committed_bytes"].set(memstat.user_physical_committed * PAGE_SIZE);
    metrics["memory_user_physical_uncommitted_bytes"].set(memstat.user_physical_uncommitted * PAGE_SIZE);
    metrics["memory_super_physical_allocated_bytes"].set(memstat.super_physical_allocated * PAGE_SIZE);
    metrics["memory_super_physical_available_bytes"].set(memstat.super_physical_available * PAGE_SIZE);
    metrics["memory_kmalloc_call_count_total"].set(memstat.kmalloc_call_count);
    metrics["memory_kfree_call_count_total"].set(memstat.kfree_call_count);
}

// Simply output to stdout, and rely on the caller to write to a file that can be served to prometheus.
// @ts-ignore - we don't want to pull in the "Node" or "DOM" libs.
console.log(metrics.toString());
