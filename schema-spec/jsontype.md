# JSON Types

JSON data types are for storing JSON (JavaScript Object Notation) data. Json types are useful when you don't want to deal with the entity relations or store structured data.

## Define Json Types

Json types should be decorated with `@jsonField`.

- A json type member/field can be type of scalar or a json type.
- Full text search is not supported on json types
- Filtering nested json is not supported for example `{params_json: { additionalData: { data_eq: "0x000" } }}`.
  Only one level filtering works.

Hydra generates objects for all the json types in your input schema. Generated objecs are located at `generated/graphql-server/src/modules/jsonfields` and can be imported from `generated/graphql-server/model` as well.

Lets look at an example:

```graphql
type AdditionalData @jsonField {
  data: Bytes
}

type EventParam @jsonField {
  name: String
  type: String
  value: String

  additionalData: [AdditionalData!]
}

type SystemEvent @entity {
  id: ID!
  params: EventParam!
}
```

## Quering Json Types

**Fetching**
Hydra generates graphql types that are available for queries. For the schema above we can write a query like this:

```graphql
query {
  systemEvents {
    params {
      name
      additionalData {
        data
      }
    }
  }
}
```

**Filtering**

Json data filtering is possible with `_json` operator:

```graphql
query {
  # Filter events which param name equals to "account"
  systemEvents(where: { params_json: { name_eq: "account" } }) {
    params {
      name
      additionalData {
        data
      }
    }
  }
}
```

## Json Types in Mappings

```typescript
export async function systemEventHandler({
  store,
}: BlockContext & StoreContext) {
  const params = new EventParam()
  params.name = 'account'
  params.type = 'string'
  params.value = '0x000'

  const additionalData = new AdditionalData()
  additionalData.data = Buffer.from(`000`)

  params.additionalData = [additionalData]

  const event = new SystemEvent()
  event.params = params

  await store.save<SystemEvent>(event)
}
```
