# Building with Docker

The squid template repository comes with a `Dockerfile` included.

The PostgreSQL database is already a docker-compose dependency by default, so this means that the [processor](../../key-concepts/processor.md) and the GraphQL server can be run as microservices in a container orchestration system, such as Kubernetes.

### Build the project's docker image

In order to build an image of your customized project, provided you do have Docker installed and access to its CLI, simply launch the following command from the project's main folder, in a terminal window:

```bash
docker build . -t <image_name:image_version>
```

Where `image_name` and `image_version` should be substituted with the values that better fit your project.

Below, you can see a screenshot of the Docker image process:

![Building a Docker image of the squid-template](<../../.gitbook/assets/docker build.png>)

In order to run the container, simply launch `docker run <image_name>:<image_version>` (you can omit `image_version` if it was labeled `latest`).

But in order to test if everything is in order, we could launch the command by mapping the container port to the host's port, and check if we have access to the GraphiQL playground:

```bash
docker run -d -p 4000:4000 --name sqdl squid-template:latest
```

And when visiting the URL `localhost:4000/graphql` in the browser, we should see this:

![Accessing the GraphiQL playground of the launched container](<../../.gitbook/assets/container graphql.png>)

{% hint style="info" %}
The 4000 port has been chosen, because it is explicitly exposed during the building process of the Docker image.
{% endhint %}

### Rules and conventions for a custom build

The `Dockerfile` shipped with the project should be useful for most use-cases, but as it is often the case, one may want to customize it, or personalize the resulting image. Here are some base rules and convention for how the final Docker image should behave:

1. The resulting image should expose ports `3000` and `4000` for processor Prometheus metrics and Graphql-server, respectively.
2. `An` `init` script should be defined in `package.json`. Such script will be executed before startup of any other service (run database migrations, etc).
3. `An` `api` script (alternatively `query-node`) must be defined in`package.json`. This should launch the api server accepting connections at port 4000.
4. `In` `package.json` there should be a `proc-*` script for every chain processor (e.g. `proc-kusama-balances`).
5. For database connection, the application must consult the following environment variables: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`.
