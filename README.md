# Next Story

Playground app to figure out how to integrate the chosen tech stack:
- React/NextJS
- Mantine
- Storybook
- Jest
- Testing Library
- Cypress
- Docker

## NPM Commands

### Project Root Commands

#### General Commands
- **`fetcher`**: Runs the fetcher script to fetch data from production container.
- **`copy-data`**: Copies the fetched data from production container to the `frontend` directory.
- **`copy-types`**: Runs the script to generate Strapi types in the `backend` directory, then copies the generated types to the `frontend` directory. This is required so that we can build the dev/prod docker containers, as importing from other containers directly won't be possible.

#### Docker Compose Commands for Development
- **`compose-dev`**: Starts the Docker Compose services with the development profile using the specified environment files.
- **`compose-dev:build`**: Builds the Docker Compose services with the development profile, ignoring the cache.
- **`compose-dev:recreate`**: Recreates the Docker Compose services with the development profile, forcing recreation and renewing anonymous volumes.

#### Docker Compose Commands for Storybook
- **`compose-sb`**: Starts the Docker Compose services with the Storybook profile using the specified environment files.
- **`compose-sb:build`**: Builds the Docker Compose services with the Storybook profile, ignoring the cache.
- **`compose-sb:recreate`**: Recreates the Docker Compose services with the Storybook profile, forcing recreation and renewing anonymous volumes.

#### Docker Compose Commands for Production
- **`compose-prod`**: Starts all Docker Compose services with the production profile using the specified environment files.
- **`compose-prod:backend`**: Starts the backend services with the production profile using the specified environment files.
- **`compose-prod:fetcher`**: Starts the fetcher service (`ns_fetcher_prod`) with the production profile using the specified environment files.
- **`compose-prod:frontend`**: Starts the frontend service (`ns_nextjs_prod`) with the production profile using the specified environment files.
- **`compose-prod:build`**: Builds all Docker Compose services with the production profile, ignoring the cache.
- **`compose-prod:build:backend`**: Builds the backend services with the production profile, ignoring the cache.
- **`compose-prod:build:fetcher`**: Builds the fetcher service (`ns_fetcher_prod`) with the production profile, ignoring the cache.
- **`compose-prod:build:frontend`**: Builds the frontend service (`ns_nextjs_prod`) with the production profile, ignoring the cache.
- **`compose-prod:recreate`**: Recreates all Docker Compose services with the production profile, forcing recreation and renewing anonymous volumes.
- **`compose-prod:recreate:backend`**: Recreates the backend services with the production profile, forcing recreation and renewing anonymous volumes.
- **`compose-prod:recreate:fetcher`**: Recreates the fetcher service (`ns_fetcher_prod`) with the production profile, forcing recreation and renewing anonymous volumes.
- **`compose-prod:recreate:frontend`**: Recreates the frontend service (`ns_nextjs_prod`) with the production profile, forcing recreation and renewing anonymous volumes.

### Backend (Strapi) Commands
- **`develop`**: Runs the Strapi development server.
- **`start`**: Starts the Strapi application with production server.
- **`build`**: Builds the Strapi application for production.
- **`strapi`**: Runs the Strapi CLI.
- **`types`**: Generates TypeScript types for Strapi.
- **`config`**: Runs the `config-sync` command to export the Strapi config.
- **`sitemap`**: Generates a sitemap for the Strapi application.

### Fetcher Commands
- **`start`**: Starts the fetcher script to get data from the production Strapi container.
