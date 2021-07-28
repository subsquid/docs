---
description: Results from your query can be sorted by using the orderBy argument.
---

# Sorting

The sort order \(ascending vs. descending\) is set by specifying the asc or desc enum value for the column name in the `orderBy` input object, e.g. `title_DESC`.

The `orderBy` argument takes an array of field to allow sorting by multiple columns.

**Sorting entities**

Example: Fetch a list of videos sorted by their titles in an ascending order:

```graphql
query {
  videos(orderBy: [title_ASC]) {
    id
    title
  }
}
```

**Sorting entities by multiple fields**

Example: Fetch a list of videos that is sorted by their titles \(ascending\) and then on their published date \(descending\):

```graphql
query {
  videos(orderBy: [title_ASC, publishedOn_DESC]) {
    id
    title
    publishedOn
  }
}
```

