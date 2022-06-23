import { Collector, Counter, Gauge } from "../metrics.js";

const PAGE_SIZE = 4096;

export class MemoryCollector extends Collector {
    name = "memory";

    metrics = [
        new Gauge({
            name: "memory_kmalloc_allocated_bytes",
            help: "The total amount of allocated kmalloc (Kernel heap) memory in bytes.",
        }),
        new Gauge({
            name: "memory_kmalloc_available_bytes",
            help: "The total amount of available kmalloc (Kernel heap) memory in bytes.",
        }),
        new Gauge({
            name: "memory_user_physical_allocated_bytes",
            help: "The total amount of memory allocated as user mode pages in bytes.",
        }),
        new Gauge({
            name: "memory_user_physical_available_bytes",
            help: "The total amount of unused memory available as user mode pages in bytes.",
        }),
        new Gauge({
            name: "memory_user_physical_committed_bytes",
            help: "The total amount of unused but reserved memory available as user mode pages in bytes.",
        }),
        new Gauge({
            name: "memory_user_physical_uncommitted_bytes",
            help: "The total amount of unused, unreserved memory available as user mode pages in bytes.",
        }),
        new Gauge({
            name: "memory_super_physical_allocated_bytes",
            help: "The total amount of memory allocated as superuser mode pages in bytes.",
        }),
        new Gauge({
            name: "memory_super_physical_available_bytes",
            help: "The total amount of unused memory available as superuser mode pages in bytes.",
        }),
        new Counter({
            name: "memory_kmalloc_call_count_total",
            help: "The total number of kmalloc() calls.",
        }),
        new Counter({
            name: "memory_kfree_call_count_total",
            help: "The total number of kfree() calls.",
        }),
    ];

    updateMetrics(registry) {
        const memstat = loadJSON("/proc/memstat");
        registry.metrics["memory_kmalloc_allocated_bytes"].set(memstat.kmalloc_allocated);
        registry.metrics["memory_kmalloc_available_bytes"].set(memstat.kmalloc_available);
        registry.metrics["memory_user_physical_allocated_bytes"].set(memstat.user_physical_allocated * PAGE_SIZE);
        registry.metrics["memory_user_physical_available_bytes"].set(memstat.user_physical_available * PAGE_SIZE);
        registry.metrics["memory_user_physical_committed_bytes"].set(memstat.user_physical_committed * PAGE_SIZE);
        registry.metrics["memory_user_physical_uncommitted_bytes"].set(memstat.user_physical_uncommitted * PAGE_SIZE);
        registry.metrics["memory_super_physical_allocated_bytes"].set(memstat.super_physical_allocated * PAGE_SIZE);
        registry.metrics["memory_super_physical_available_bytes"].set(memstat.super_physical_available * PAGE_SIZE);
        registry.metrics["memory_kmalloc_call_count_total"].set(memstat.kmalloc_call_count);
        registry.metrics["memory_kfree_call_count_total"].set(memstat.kfree_call_count);
    }
}
