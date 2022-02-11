# Cross-relation field queries



```graphql
query {
  users(where:{posts_some:{id: "1"}}){
    name
  }
}
```
