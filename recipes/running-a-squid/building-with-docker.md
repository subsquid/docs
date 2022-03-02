# Building with Docker

The squid template repository comes with a `Dockerfile` included.

The PostgreSQL database is already a docker-compose dependency by default, so this means that the [processor](../../key-concepts/processor.md) and the GraphQL server can be run as microservices in a container orchestration system, such as Kubernetes.

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
