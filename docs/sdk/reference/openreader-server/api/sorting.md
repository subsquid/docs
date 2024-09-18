---
sidebar_position: 60
title: Sorting
description: >-
  The orderBy argument
---

# Sorting

## Sort order

The sort order (ascending vs. descending) is set by specifying an `ASC` or `DESC` suffix for the column name in the `orderBy` input object, e.g. `title_DESC`.

### **Sorting entities**

Example: Fetch a list of videos sorted by their titles in an ascending order:

```graphql
query {
  videos(orderBy: title_ASC) {
    id
    title
  }
}
```
or
```graphql
query {
  videos(orderBy: [title_ASC]) {
    id
    title
  }
}
```

### **Sorting entities by multiple fields**

The `orderBy` argument takes an array of fields to allow sorting by multiple columns.

Example: Fetch a list of videos that is sorted by their titles (ascending) and then on their published date (descending):

```graphql
query {
  videos(orderBy: [title_ASC, publishedOn_DESC]) {
    id
    title
    publishedOn
  }
}
```
