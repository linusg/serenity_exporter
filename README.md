# serenity_exporter

A Prometheus exporter for SerenityOS.

## Installation

Copy the cloned repository, or at minimum, `exporter.js`, `metrics.js`, and `run.js` into the
SerenityOS disk image.

NOTE: In the future a port script will be provided upstream.

## Usage

The exporter simply can be run standalone using the js(1) REPL, as a module:

```console
js -m exporter.js
```

For convenience, a SerenityOS Shell script is provided to start WebServer in the current working
directory and export to `metrics.txt` every 10 seconds.

It can either be invoked manually, or run by SystemServer after boot by adding a service like this:

```ini
[serenity_exporter]
Executable=/bin/Shell
Arguments=run.sh
WorkingDirectory=/path/to/serenity_exporter
KeepAlive=true
```

Lastly, add a new scrape configuration to `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: "serenity"
    metrics_path: "/metrics.txt"
    static_configs:
      - targets: ["localhost:8000"]
```
