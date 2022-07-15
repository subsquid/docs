# How do I start the processor?

First, make sure you have compiled your project with

```bash
npm run build
```

Then simply run

```bash
node -r dotenv/config lib/processor.js
```

Note that `-r dotenv/config` ensures that the database settings are picked up from `.env`. If you the environment variables them elsewhere, skip it.
