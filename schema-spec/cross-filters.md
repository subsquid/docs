---
description: Filter query results with related entity fields
---

# Cross filtering

Cross-relation filters allows you to filter query results with the related entity fields.

During the example we will use the below schema:

```graphql
type Channel @entity {
  id: ID!
  handle: String!
  videos: [Video!] @derivedFrom(field: "channel")
}

type Video @entity {
  id: ID!
  title: String!
  channel: Channel!
  featured: FeaturedVideo @derivedFrom(field: "video")
  publishedBefore: Bool!
}

type FeaturedVideo @entity {
  id: ID!
  video: Video!
}
```

**Filter 1-1 relations**

Fetch all the featured videos those title contains `joy`:

```graphql
query {
  featuredVideos(where: { video: { title_contains: "joy" } }) {
    id
    video {
      title
    }
  }
}
```

**Filter 1-M relations**

Fetch all the videos published under `Joystream` channel:

```graphql
query {
  videos(where: { channel: { handle_eq: "Joystream" } }) {
    title
  }
}
```

**Modifiers** There are three modifiers can be use for M-1 and M-M relationships.

* some: if any of the entities in the relation satify a condition
* every: if all of the entities in the relation satify a condition
* none: if none of the entities in the relation satify a condition

**Fetch if any of the entities in the relation satify a condition** Example:

Fetch all channels which have at least one video with a title that contains `kid`

```graphql
query {
  channels(where: { videos_some: { title_contains: "kid" } }) {
    handle
    videos {
      title
    }
  }
}
```

**Fetch if all of the entities in the relation satify a condition** Example:

Fetch all channels which have all of their videos `publishedBefore_eq: true`:

```graphql
query {
  channels(where: { videos_every: { publishedBefore_eq: true } }) {
    handle
    videos {
      title
    }
  }
}
```

**Fetch if none of the entities in the relation satify a condition**

Fetch all channels which have none of their videos `publishedBefore_eq: true`:

```graphql
query {
  channels(where: { videos_none: { publishedBefore_eq: true } }) {
    handle
    videos {
      title
    }
  }
}
```

