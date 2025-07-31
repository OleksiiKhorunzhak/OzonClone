# Deployment

## Connect to Server

In order to connect to the server, use the following command:

```bash
ssh admin@ozone.vepr.net.ua
```

Server allows only SSH key authentication. You need to have a private key to connect to the server.

If you don't have a private key, you can generate it using the following command:

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Provide your public part to the server administrator.

## Login to Docker Registry

Docker on the server already logged in to the ghcr.io Docker registry. So you can to pull images from the GitHub Container Registry without any additional actions.

In case of issues with current session, you can re-login to the Docker registry using the following steps:

- generate a personal access token on the GitHub with `read:packages` scope
- save the token as environment variable `export CR_PAT=YOUR_TOKEN`
- run the following command: `echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin`

For detailed instructions, see the [GitHub documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry#authenticating-with-a-personal-access-token-classic).

## Install

- copy `caddy`, `prod`, `stage`, `dev` directories to `/opt/docker` in your server
- copy `Opir/compose.yaml` to `prod`, `stage`, `dev` folder
- edit `compose.override.yaml` in `prod` and `stage` with your current Docker images tags
- run `docker compose up -d` in `prod`, `stage`, `dev`, `caddy` directories

## Update Dev

- change directory to `/opt/docker/dev`
- run `compose pull` to pull the latest images
- run `docker compose up -d`

## Update Stage

- change directory to `/opt/docker/stage`
- edit `compose.override.yaml` with your current Docker images tags
- run `docker compose up -d`

## Update Prod

- change directory to `/opt/docker/prod`
- edit `compose.override.yaml` with your current Docker images tags
- run `docker compose up -d`

## Update Caddy configuration

- change directory to `/opt/docker/caddy`
- edit `Caddyfile` with your current configuration
- run `docker compose restart`

## Update Caddy version

- change directory to `/opt/docker/caddy`
- run `docker compose pull` to pull the latest images
- run `docker compose up -d`