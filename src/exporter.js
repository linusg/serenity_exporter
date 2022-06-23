import { Counter, Gauge, Info, Registry } from "./metrics.js";

const PAGE_SIZE = 4096;

const registry = new Registry("serenity");

registry.addMetric(
    new Gauge({
        name: "memory_kmalloc_allocated_bytes",
        help: "The total amount of allocated kmalloc (Kernel heap) memory in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_kmalloc_available_bytes",
        help: "The total amount of available kmalloc (Kernel heap) memory in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_user_physical_allocated_bytes",
        help: "The total amount of memory allocated as user mode pages in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_user_physical_available_bytes",
        help: "The total amount of unused memory available as user mode pages in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_user_physical_committed_bytes",
        help: "The total amount of unused but reserved memory available as user mode pages in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_user_physical_uncommitted_bytes",
        help: "The total amount of unused, unreserved memory available as user mode pages in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_super_physical_allocated_bytes",
        help: "The total amount of memory allocated as superuser mode pages in bytes.",
    })
);
registry.addMetric(
    new Gauge({
        name: "memory_super_physical_available_bytes",
        help: "The total amount of unused memory available as superuser mode pages in bytes.",
    })
);
registry.addMetric(
    new Counter({
        name: "memory_kmalloc_call_count_total",
        help: "The total number of kmalloc() calls.",
    })
);
registry.addMetric(
    new Counter({
        name: "memory_kfree_call_count_total",
        help: "The total number of kfree() calls.",
    })
);
registry.addMetric(
    new Info({
        name: "os_info",
        help: "OS version information.",
    })
);
registry.addMetric(
    new Gauge({
        name: "time_seconds",
        help: "The system's epoch time in seconds.",
    })
);
registry.addMetric(
    new Counter({
        name: "time_uptime_seconds_total",
        help: "The system's uptime in seconds.",
    })
);

// Memory
{
    const memstat = loadJSON("/proc/memstat");
    registry["memory_kmalloc_allocated_bytes"].set(memstat.kmalloc_allocated);
    registry["memory_kmalloc_available_bytes"].set(memstat.kmalloc_available);
    registry["memory_user_physical_allocated_bytes"].set(memstat.user_physical_allocated * PAGE_SIZE);
    registry["memory_user_physical_available_bytes"].set(memstat.user_physical_available * PAGE_SIZE);
    registry["memory_user_physical_committed_bytes"].set(memstat.user_physical_committed * PAGE_SIZE);
    registry["memory_user_physical_uncommitted_bytes"].set(memstat.user_physical_uncommitted * PAGE_SIZE);
    registry["memory_super_physical_allocated_bytes"].set(memstat.super_physical_allocated * PAGE_SIZE);
    registry["memory_super_physical_available_bytes"].set(memstat.super_physical_available * PAGE_SIZE);
    registry["memory_kmalloc_call_count_total"].set(memstat.kmalloc_call_count);
    registry["memory_kfree_call_count_total"].set(memstat.kfree_call_count);
}

// OS
{
    const versionParts = loadINI("/res/version.ini");
    const version = `${versionParts["Version"]["Major"]}.${versionParts["Version"]["Minor"]}.${versionParts["Version"]["Git"]}`;
    registry["os_info"].set({ version });
}

// Time
{
    const uptime = loadJSON("/proc/uptime");
    const epochTime = Date.now() / 1000;
    registry["time_seconds"].set(epochTime);
    registry["time_uptime_seconds_total"].set(uptime);
}

// Simply output to stdout, and rely on the caller to write to a file that can be served to prometheus.
// @ts-ignore - we don't want to pull in the "Node" or "DOM" libs.
console.log(registry.toString());
