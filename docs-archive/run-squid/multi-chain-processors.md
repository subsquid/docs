# Multi-chain processors

Subsquid framework does not impose any limit's to the builder's creativity. Thanks to its modular structure and multi-layer architecture, it is possible to develop multiple processors, connected to multiple blockchain archives, as part of one single Squid API.

These multiple processors will share a common database and their data will be served by one single API endpoint.

### Multiple processor files

In a single Squid project, developers can define the schema, have TypeScript models generated, just as usual, but they can also create multiple `processor*.ts` files.

![Multiple processors in the squid-template project](<../../.gitbook/assets/folder structure.png>)

Each one will instantiate a `SubstrateProcessor` class (or any other future kind of `Processor` classes in development) to ingest data from a specific chain, transform it and persist it in the database.

### Processor start-up script

Each processor file has to be launched, in order to start treating data. To do so, it is advised to define a script in `package.json` for each of the processor files:

{% code title="package.json" %}
```json
{
    ...
    "scripts": {
        ...
        "processor-k:start": "node lib/processor_kusama.js",
        "processor-p:start": "node lib/processor_polkadot.js",
        ...
    }
    ...
}
```
{% endcode %}

It is advised to use a naming convention that prefixes all these scripts with `proc*` so that these can be compatible with our SaaS solution.
