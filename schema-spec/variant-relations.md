---
description: Define variant types with relations
---

# Variant relations

Variant types support entity relationship in a different way unlike the normal entity relationship. There are some limitations with variant relations:

* Only one-to-many and many-to-one relations are supported
* Reverse lookup is not supported

Let's take a look an example:

1. Schema: in the schema below there are two variant types with the relations

```graphql
type BoughtMemberEvent @entity {
  id: ID!
  name: String
  handle: String!
}

type InvitedMemberEvent @entity {
  id: ID!
  name: String
  handle: String!
}

type MemberInvitation @variant {
  event: InvitedMemberEvent!
}

type MemberPurchase @variant {
  event: BoughtMemberEvent!
}

union MemberSource = MemberInvitation | MemberPurchase

type Member @entity {
  id: ID!
  isVerified: Boolean!
  handle: String!
  source: MemberSource!
}
```

1. Mappings: insert data into database

For variant relations to work an additional field is added to variant type which is db only field \(which means it is not visible in the graphql API\). This field is will be generated from relation field name + 'id' ie. in the schema above relation name is `event` so the auto generated field name is `eventId`. This field is not optional and mapping author must set it properly.

```typescript
async function handle_Member(db: DB, event: SubstrateEvent) {
  // Create an event from BoughtMemberEvent or MemberInvitation and save to db
  let event = new InvitedMemberEvent({ handle: 'joy' })
  event = await db.save<InvitedMemberEvent>(event)

  // Create variant instance and set eventId property
  const invitation = new MemberInvitation()
  // Auto generated property, it holds primary key of the related entity
  invitation.eventId = event.id

  // Create new member and set the source property
  const member = new Member({ handle: 'hydra', isVerified: true })
  member.source = invitation
  await db.save<Member>(member)
}
```

1. Query: fetch all members' `source`:

```graphql
query {
  members {
    source {
      __typename
      ... on MemberInvitation {
        event {
          id
          name
          handle
        }
      }
    }
  }
}
```

