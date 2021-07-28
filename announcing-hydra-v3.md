# What's new in Hydra v3

Hydra v3 is already in the works. Here are the main features planned:

* Support for filtering by relations
* Support for adding relations to variant types
* Ordering by multiple fields
* Multiple filters in the same query \(`AND` and `OR`\)
* Filters for mapping handlers: specify heights and runtime spec version range
* Import all model files from a single library. Instead of the cumbersome

```typescript
import { MyEntity1 } from '../generated/graphql-server/my-entity2/my-entity2.model'
import { MyEntity2 } from '../generated/graphql-server/my-entity2/my-entity2.model'
```

write

```typescript
import { MyEntity1, MyEntity2 } from '../generated/graphql-server/model'
```

