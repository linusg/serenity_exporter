#!/bin/Shell

WebServer . &
loop {
    js -m src/exporter.js > metrics.txt
    sleep 10
}
