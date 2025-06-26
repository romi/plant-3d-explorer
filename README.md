![badge](https://github.com/romi/plant-3d-explorer/workflows/Tests/badge.svg)

# Plant 3D Explorer

Welcome to the Plant 3D Explorer - a web application for exploring 3D plant acquisitions and reconstructions developed by the ROMI project.

<img src="doc/images/screenshot_2.png" alt="Browsing screenshot" width="400">
<img src="doc/images/screenshot_1.png" alt="Exploring screenshot" width="400">

For comprehensive documentation on the entire ROMI project, visit the [official documentation](https://docs.romi-project.eu).

## System Requirements

### Node.js Environment

The application requires `npm`, which is included with . We recommend using: `Node.js`

- version 10 or higher **Node.js**
- **npm** version 6 or higher

### Recommended Installation Method

We strongly recommend using `nvm` (Node Version Manager) for a more flexible installation:

``` bash
# Install NVM (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Install Node.js version 10
nvm install 10

# Verify Node.js installation
node -v  # Should display v10.24.1

# Verify npm installation
npm -v   # Should display 6.14.12
```

For installation instructions on other distributions, refer to the [nvm GitHub repository](https://github.com/nvm-sh/nvm).

## Getting Started

### Installation

1. Clone the repository:
    ``` bash
    git clone https://github.com/romi/plant-3d-explorer.git
    cd plant-3d-explorer
    ```
2. Install dependencies:
    ``` bash
    npm install
    ```

### Development & Testing

The following commands are available in the project directory:

| Command         | Description                               |
|-----------------|-------------------------------------------|
| `npm test`      | Run tests in watch mode                   |
| `npm start`     | Start the application in development mode |
| `npm run build` | Build the application for production      |

#### Running Tests

Tests run in watch mode and automatically rerun when files change. Each component has its test file in the same directory (e.g.,
`src/ScanList/index.test.js` tests `src/ScanList/index.js`).

#### Development Mode

Start the development server:

``` bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

#### API Configuration

Configure the PlantDB API URL by creating an `.env` file at the project root:

``` 
REACT_APP_API_URL='plantdb_address.com'
```

Without this configuration, the application defaults to `http://localhost:5000`.

> **Notes:**
> - You must run a PlantDB REST API server from the [plantdb repository](https://github.com/romi/plantdb).
> - `start` is an alias, defined in [package.json](package.json) under the `scripts` section, that calls
    `react-scripts start` and automatically set `NODE_ENV=development`.

> **Warning:** For running on bleeding-edge Linux distributions (like Fedora or Arch-based systems),
> see [issue #155](https://github.com/romi/plant-3d-explorer/issues/155). `plant-3d-explorer`
>

#### Production Build

Create an optimized production build:

``` bash
npm run build
```

This generates production-ready files in the `build` folder with minified code and hashed filenames.

> **Notes:**
> - You must run a PlantDB REST API server from the [plantdb repository](https://github.com/romi/plantdb).
> - `build` is an alias, defined in [package.json](package.json) under the `scripts` section, that calls
    `react-scripts build` and automatically set `NODE_ENV=production`.

## Docker Usage

### Building a Docker Image

To build the Docker image:

```bash
./docker/build.sh
```

Use the `-h` option for more build options.

The application will be available at [http://localhost:3000](http://localhost:3000).

> **Important:
** Use Chrome for the best experience as Firefox may have compatibility issues with some JavaScript libraries.

To publish the image to Docker Hub:

``` bash
docker push roboticsmicrofarms/plant-3d-explorer:2.1
```

This requires valid Docker Hub credentials and an existing repository.

### Using Pre-built Docker Images

Pull the pre-built image:

``` bash
docker pull roboticsmicrofarms/plant_3d_explorer
```

Run the container:

``` bash
docker run -p 3000:3000 roboticsmicrofarms/plant_3d_explorer
```

## Docker Compose Setup

For testing or development with a local database, we provide a Docker Compose configuration that:

1. Starts a PlantDB container using `roboticsmicrofarms/plantdb`
2. Starts a Plant 3D Explorer container using `roboticsmicrofarms/plant-3d-explorer`

> **Note:**
> Docker Compose must be installed.
> See [installation instructions](https://docs.docker.com/compose/install/).

### Using Pre-built Images

``` bash
export ROMI_DB=<path/to/db> && \
docker compose -f ./docker/docker-compose.yml up
```

> **Important:**
> Set `ROMI_DB` to the path of your database.


To stop the containers:

``` bash
docker compose -f ./docker/docker-compose.yml stop
```

### Using Local Builds

For development or debugging:

1. Build your image with a specific tag (e.g., `debug`)
2. Edit the `docker-compose.yml` file to use your custom-tagged image

## Documentation

### View Documentation

The technical documentation is available at [https://romi.github.io/plant-3d-explorer/](https://romi.github.io/plant-3d-explorer/).

### Contributing to Documentation

This project uses [docz](https://docz-v1.surge.sh/) for documentation. To contribute:

1. Install docz and its dependencies:
    ``` bash
    npm install docz@1.3.2 docz-theme-default
    ```
2. Start the documentation development server:
    ``` bash
    npm run docz:dev
    ```

To build documentation in a container:

``` bash
./docker/run.sh -v $(pwd)/.docz:/app/.docz \
  -c "umask 0002 && npm install docz@1.3.2 docz-theme-default --dev && npm run docz:build"
```

For more information on using docz, visit the [official documentation](https://docz-v1.surge.sh/).
