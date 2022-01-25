# How do I write the schema?

The schema file defines the shape of the final GraphQL API and has very few limitations. Designing the schema file is very similar to the design of the database schema. As a rule of thumb, the schema should represent high level domain specific entities and relations between them, to make data fetching and filtering easy for the API consumers.

Typically, the API is consumed by the frontend and mobile apps, so it's a good idea to design the schema even before you go on with implementing the processor mappings. In fact, the processor is completely indpendent from the GraphQL server serving the API, so you can experiment how the API looks like.
