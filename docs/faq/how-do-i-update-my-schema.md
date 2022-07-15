# How do I update my schema?

## Destructive option

TL;DR: If you're ok dropping the database, simply update `schema.graphql` and run:

```bash
bash reset-schema.sh
```

**NOTE!** The database will be wiped out, so if it's not an option, read below.

## Non-destructive option

Here's a step-by-step instruction. First, generated the model files:

```bash
npx sqd codegen
npm run build
```

Now you have to options: either create a migration for an incremental schema update or recreate the whole schema from scratch.

During the development process, recreating the schema is often more convenient. However, if you already have a running API in production and don't want to resync it, having an incremental update is preferrable (but requires data backfilling).

### Option 1: Recreate schema from scratch

Run

```bash
bash reset-db.sh
```

### Option 2: Make an incremental update to the schema

Generate a migration for the incremental changes and apply it

```bash
npx sqd db create-migration AddMyAwesomeNewField
npx sqd db migrate
```

You can find the newly generated and applied migration in `db/migrations`.
