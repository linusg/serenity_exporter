import { MemoryCollector, OSCollector, TimeCollector } from "./collectors/index.js";
import { Registry } from "./metrics.js";

const registry = new Registry("serenity");

registry.addCollector(new MemoryCollector());
registry.addCollector(new OSCollector());
registry.addCollector(new TimeCollector());

for (const collector of Object.values(registry.collectors)) {
    collector.collect(registry);
}

// Simply output to stdout, and rely on the caller to write to a file that can be served to prometheus.
// @ts-ignore - we don't want to pull in the "Node" or "DOM" libs.
console.log(registry.toString());
