# Next Story

Proof of Concept project, to demonstrate the integration of the following tech stack to customers:
- React/NextJS (Frontend)
- Mantine (Frontend/UI)
- Storybook (Frontend/UI)
- Jest (Testing)
- Testing Library (Testing)
- Cypress (Testing)
- Strapi (Backend)
- Postgres (Database)
- Docker (Containers)

## Project Setup

1. **Install Dependencies**: Install NPM dependencies via the `npm install` command in the `/backend`, `/fetcher` and `/frontend` folders. We do this to enable VS Code IntelliSense features. If we don't install dependencies, VS Code will complain on all imports and autocompletion will not work. This is required, even if we use Docker. Keep in mind, you need at least Node.js `18.17` or later to run this project. Only LTS versions of Node.js are supported to run Strapi and Next.js 14.

2. **Add Environment Variables**: Add `.env`, `dev.env` and `prod.env` files. The main `.env` file must contain everything in the `.env.example` file provided in the repo. The `dev.env` and `prod.env` files only override specific environment variables that are required for the specific environment (`development`, `production`, etc.). The `NEXT_PUBLIC_BACKEND_URL`, `NEXT_STRAPI_FE_APIKEY` and `NEXT_STRAPI_BE_APIKEY` environment variables can be left empty in the main `.env` file, and only add values in the `dev.env` and `prod.env` files. This, of course, is only valid for the local development environment. We will need to fill all the variables in production.

    ```
    NEXT_PUBLIC_BACKEND_URL=
    NEXT_STRAPI_FE_APIKEY=
    NEXT_STRAPI_BE_APIKEY=
    ```

    Please note that we need to respect the file naming convention, as the environment files are specified in the `docker compose` commands. If we don't specify the file names in the `docker compose` commands, Docker will only load the `.env` file by default, and only adding the files under the `env_file` key, in the `compose.yml` or `compose.prod.yml` configuration files will not work!

3. **Create Data Directories**: We also need to manually create `/data` directories under `/fetcher` and `/frontend` folders. We need to do this because the `fetcher` container needs the folders to already be present, or it won't be able to mount the folder as a volume when running. These folders are required so that we can export data from the Strapi backend, into static `.json` files, to be able to build the production (frontend) Next.js container. We need to do this, because Docker doesn't have access to the network during build steps. This isn't an issue during development, because we don't have multi-stage `Dockerfile` configuration.

    TODO: Add a setup script to eliminate the steps above.

4. **Build & Run Development Containers**: After completing the steps above, we can finally start building and running the Docker containers for development via Docker Compose in the following order:

    - **Build Development Containers** via the `npm run compose-dev:build` NPM command. This command builds the containers fully, with no cache. We need to build the containers this way because the `docker compose up --build` command, caches the dependencies and doesn't rebuild them when we have new dependencies (e.g. new NPM packages).

    - **Run Development Containers**: After the build step finished, we can run the `npm run compose-dev:recreate` to bring our development containers up. We run the `recreate` command because we want our code to be updated inside the containers when we run them. This prevents stale code to be run, from when we've built the container initially. However, we still need to do full container builds periodically, especially when our code or data structures change significantly.

    - **Seed Strapi with Data**: If this is the first time when we run this project, we need to import (seed) data, or to populate Strapi with our own data. We can import data into Strapi via the `npm run strapi import` within the Strapi container.

        TODO: Add seed data to be imported into Strapi (from Strapi export) and also add instruction on how to seed data (maybe create a seed script).

5. **Build & Run Storybook Container**: This will run only in the development environment, and doesn't need any data, as it only builds the frontend (Next.js) with Storybook added to it. This container is exclusively used to build the UI. 

    Please note that the components that we build with Storybook don't need to be dependent on data fetching, as this will not be available when running the Storybook container! We can only rely on mock data and data passed to components from Storybook stories when building components.

    To run the Storybook container, we follow the steps below:

    - **Build Storybook Container**: We build the container via the `npm run compose-sb:build` command. This builds the container with no cache, similarly to the development containers.

    - **Run Storybook Container**: We run the container via the `npm run compose-sb:recreate` command. Similarly to the development containers, we need to recreate the container, so that we have our latest code. This will only run Storybook, and we can access it via the port `6006` in our browser, independent of the Next.js container.

6. **Build & Run Production Containers**: Finally, after we've developed our project, we can build and run our production containers. This is a bit more tricky to achieve, so we must follow the steps below:

    - **Build & Run Backend Containers Only**: Before we run the whole thing, we need to run the backend containers first (Postgres, Strapi and Fetcher), so that we can import (seed) data into Strapi. We build the containers with the `npm run compose-prod:build:backend` command, and we run the containers with the `npm run compose-prod:recreate:backend` command. This time the `fetcher` container will also run automatically, after the Strapi backend is up, in order to export the Strapi data (as previously explained). If this is the first time we run the production containers, we will need to seed or populate Strapi with data. We can seed Strapi via the `npm run strapi import` command from within the Strapi container.

        TODO: Add seed data to be imported into Strapi (from Strapi export) and also add instruction on how to seed data (maybe create a seed script).

    - **Build Production Containers**: After we've populated Strapi with data, we can build all production containers with the `npm run compose-prod:build` command. For this to happen, the `data` folder must already exist both in the `/fetcher` and `/frontend` directories. The `data` folders can be empty, as the `ns_fetcher_prod` container will use a named volume mount to export and save the data from Strapi inside Docker. As previously explained, the `data` folders must already be present, and populated with `.json` files, otherwise the `ns_nextjs_prod` container will fail to build, because there's no networking available during the build stage. The `ns_fetcher_prod` container will run automatically before the `ns_nextjs_prod` container, and exit after it exports the data.

    - **Run Production Containers**: Finally, after we've built the production containers, and populated the data, we can run them via the `npm run compose-prod:recreate` command. If all is well, and we did all our previous steps, this should run all our production containers.

        Please note that all these instructions are only required for the local Docker environment, and for testing the production builds of our website. Deployment to productions will be different and dependent on the platform we deploy on.

TODO: Add deployment instructions for Docker on a Coolify server (preferably with Docker Compose).

## NPM Commands

### Project Root Commands

These are commands that are project wide and need to be run in the root level directory:

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

These commands need to be run into the `backend` directory:

- **`develop`**: Runs the Strapi development server.
- **`start`**: Starts the Strapi application with production server.
- **`build`**: Builds the Strapi application for production.
- **`strapi`**: Runs the Strapi CLI.
- **`types`**: Generates TypeScript types for Strapi.
- **`config`**: Runs the `config-sync` command to export the Strapi config.
- **`sitemap`**: Generates a sitemap for the Strapi application.

### Fetcher Commands

These commands need to be run into the `fetcher` directory:

- **`start`**: Starts the fetcher script to get data from the production Strapi container.

### Frontend (NextJS) Commands

These commands need to be run into the `frontend` directory:

- **`dev`**: Runs the Next.js development server.
- **`build`**: Builds the Next.js application for production.
- **`start`**: Starts the Next.js application in production mode.
- **`lint`**: Lints the project using Next.js's linting configuration.
- **`storybook`**: Runs Storybook in development mode on port `6006`.
- **`build-storybook`**: Builds the Storybook application for production.
