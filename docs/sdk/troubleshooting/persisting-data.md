---
sidebar_position: 115
---

# Database

### `QueryFailedError: relation does not exist`

Often occurs after changing [schema](/store/postgres/schema-file) and forgetting to regenerate the [database migrations](/store/postgres/db-migrations). Try
```bash
sqd codegen
sqd build
sqd down
sqd up
sqd migration:generate
```

### `driverError: error: relation "..." does not exist` in the processor logs

It is likely that the generated migrations in the `db/migrations` folder are outdated and do not match the schema file.
Recreate the migrations from scratch as detailed in [this page](/store/postgres/db-migrations/#updating-after-schema-changes)

### `Query runner already released. Cannot run queries anymore` in the processor logs

All operations with `ctx.store` are asynchronous. Make sure you `await` on all `store` operations like `save`, `update`, `find` etc.

### `QueryFailedError: invalid byte sequence for encoding "UTF8": 0x00`

PostgreSQL doesn't support storing `NULL (\0x00)` characters in text fields. Usually the error occurs when a raw bytes string (like `UIntArray` or `Bytes`) is inserted into a `String` field. If this is the case, use hex encoding, e.g. using [`util-internal-hex`](https://github.com/subsquid/squid/tree/master/util/util-internal-hex) library. For addresses, use [`ss58` encoding library](https://github.com/subsquid/squid/tree/master/ss58)
