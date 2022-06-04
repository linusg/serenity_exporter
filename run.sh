#!/bin/Shell

WebServer . &
loop {
    js -m exporter.js > metrics.txt
    sleep 10
}
