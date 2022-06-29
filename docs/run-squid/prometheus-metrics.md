# Prometheus metrics

The Subsquid SDK comes with [Prometheus](https://prometheus.io/) metrics to monitor synchronization status. When launching the processor, it is sufficient to specify the port at which metrics should be served via the environment variable `PROCESSOR_PROMETHEUS_PORT`.

If not provided, a random port will be used and communicated at launch:

```bash
⇒ node -r dotenv/config lib/processor.js
Prometheus metrics are served at port 34491
Last block: 9422743, mapping: 33 blocks/sec, ingest: 279 blocks/sec, eta: 9h 12m, progress: 81%
Last block: 9423694, mapping: 41 blocks/sec, ingest: 217 blocks/sec, eta: 8h 37m, progress: 81%
Last block: 9424679, mapping: 41 blocks/sec, ingest: 195 blocks/sec, eta: 8h 16m, progress: 81%
Last block: 9425591, mapping: 43 blocks/sec, ingest: 218 blocks/sec, eta: 8h 10m, progress: 81%
Last block: 9426588, mapping: 44 blocks/sec, ingest: 227 blocks/sec, eta: 7h 33m, progress: 81%
Last block: 9427710, mapping: 48 blocks/sec, ingest: 182 blocks/sec, eta: 6h 57m, progress: 81%
```

Then, it is sufficient to visit the `localhost:PROCESSOR_PROMETHEUS_PORT/metrics` URL, in order to access Prometheus metrics:

![Prometheus metrics](/img/.gitbook/assets/metrics.png)

These can then be regularly polled to monitor the status and, for example, used in [Grafana dashboards](https://prometheus.io/docs/visualization/grafana/).
