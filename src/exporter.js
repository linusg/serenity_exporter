import { Counter, Gauge, Metrics } from "./metrics.js";

const PAGE_SIZE = 4096;

const memstat = loadJSON("/proc/memstat");

const kmallocAllocatedBytesGauge = new Gauge({
    name: "serenity_memory_kmalloc_allocated_bytes",
});
const kmallocAvailableBytesGauge = new Gauge({
    name: "serenity_memory_kmalloc_available_bytes",
});
const userPhysicalAllocatedGauge = new Gauge({
    name: "serenity_memory_user_physical_allocated_bytes",
});
const userPhysicalAvailableGauge = new Gauge({
    name: "serenity_memory_user_physical_available_bytes",
});
const userPhysicalCommittedGauge = new Gauge({
    name: "serenity_memory_user_physical_committed_bytes",
});
const userPhysicalUncommittedGauge = new Gauge({
    name: "serenity_memory_user_physical_uncommitted_bytes",
});
const superPhysicalAllocatedGauge = new Gauge({
    name: "serenity_memory_super_physical_allocated_bytes",
});
const superPhysicalAvailableGauge = new Gauge({
    name: "serenity_memory_super_physical_available_bytes",
});
const kmallocCallCount = new Counter({
    name: "serenity_memory_kmalloc_call_count_total",
});
const kfreeCallCount = new Counter({
    name: "serenity_memory_kfree_call_count_total",
});

const metrics = new Metrics();
metrics.addMetric(kmallocAllocatedBytesGauge);
metrics.addMetric(kmallocAvailableBytesGauge);
metrics.addMetric(userPhysicalAllocatedGauge);
metrics.addMetric(userPhysicalAvailableGauge);
metrics.addMetric(userPhysicalCommittedGauge);
metrics.addMetric(userPhysicalUncommittedGauge);
metrics.addMetric(superPhysicalAllocatedGauge);
metrics.addMetric(superPhysicalAvailableGauge);
metrics.addMetric(kmallocCallCount);
metrics.addMetric(kfreeCallCount);

kmallocAllocatedBytesGauge.set(memstat.kmalloc_allocated);
kmallocAvailableBytesGauge.set(memstat.kmalloc_available);
userPhysicalAllocatedGauge.set(memstat.user_physical_allocated * PAGE_SIZE);
userPhysicalAvailableGauge.set(memstat.user_physical_available * PAGE_SIZE);
userPhysicalCommittedGauge.set(memstat.user_physical_committed * PAGE_SIZE);
userPhysicalUncommittedGauge.set(memstat.user_physical_uncommitted * PAGE_SIZE);
superPhysicalAllocatedGauge.set(memstat.super_physical_allocated * PAGE_SIZE);
superPhysicalAvailableGauge.set(memstat.super_physical_available * PAGE_SIZE);
kmallocCallCount.set(memstat.kmalloc_call_count);
kfreeCallCount.set(memstat.kfree_call_count);

// Simply output to stdout, and rely on the caller to write to a file that can be served to prometheus.
console.log(metrics.toString());
