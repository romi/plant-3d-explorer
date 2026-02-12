# Plant 3D Explorer

![badge](https://github.com/romi/plant-3d-explorer/workflows/Tests/badge.svg)

The _Plant 3D Explorer_ is a web-based tool designed for the visualization and analysis of 3D plant acquisitions and reconstructions. Developed by the ROMI project, it allows researchers and developers to explore high-fidelity plant models, skeletons, and point clouds generated from robotic scans

For comprehensive documentation on the entire ROMI project, visit the [official documentation](https://docs.romi-project.eu).

## From Data Acquisition to Structural Analysis

_User scenario_: imagine a researcher who has just finished a multi-view 3D scan of a plant using the ROMI _[PlantImager](https://romi.github.io/plant-imager/)_ platform.

They use the _Plant 3D Explorer_ to:

- **Validate the Reconstruction**: Browse through different scans to ensure the 3D model was correctly generated.
- **Analyze Plant Structure**: Examine the skeleton and segmented point clouds to understand the branching patterns.
- **Extract Morphological Data**: Compare automated measurements (like internode lengths and branching angles) with manual ground truth or idealized models.

## GUI Walkthrough

The application is divided into several functional areas.

<figure>
  <img src="https://codimd.math.cnrs.fr/uploads/upload_dd607cdd75bfd462699f14eb62661086.png"
       alt="Screenshot presenting the Landing Page"
       width="800">
  <figcaption>
      <b>Landing page</b>: Scan List view with search, filter, preview, and download options for acquisition entries.
  </figcaption>
</figure>

<figure>
  <img src="https://codimd.math.cnrs.fr/uploads/upload_a3902c4eb89a1f45ccf301a7a328170f.png"
       alt="Screenshot presenting the Main Workspace"
       width="800">
  <figcaption>
      <b>Main Workspace</b>: 3‑D viewer with layer toggles (top left), image carousel (bottom), data panels (right), and controls for metadata, camera tools, and help.
  </figcaption>
</figure>


### 1. Scan Selection (Landing Page)

When you first open the app, you are presented with a **Scan List**.

- **Search & Filter**: Find specific acquisitions by species (_e.g._, Arabidopsis), environment, or date.
- **Preview**: Each entry shows metadata and quick links to download the raw archive or metadata files.

### 2. The 3D Viewer (Main Workspace)

Clicking a scan opens the Viewer, which is the heart of the application.

- **3D World**: The central area where the plant is rendered. You can rotate, pan, and zoom to inspect details.
- **Layer Interactors (Top-Left)**: Toggle different "views" of the plant when available:
    - **Mesh**: The full 3D surface obtained after reconstruction of the scan.
    - **Point Cloud**: The 3D point cloud obtained after reconstruction of the scan.
    - **Segmented Point Cloud**: The 3D point cloud color-coded by plant part (_e.g._, leaf, stem, ...) obtained from semantic segmentation.
    - **Skeleton**: A simplified line-based representation of the plant's architecture.
    - **Organs**: Highlight detected organs and their spatial locations.
    - **Bounding Box**: Visualizes the reconstructed volume around the plant.

### 3. Image Carousel (Bottom)

This interactive slider bar displays the original 2D photographs used to build the 3D model.

- **Camera Synchronization**: Selecting a photo in the carousel shows the image with its corresponding camera position in the 3D space.
- **Visual Validation**: Select a photo to see it in detail, allowing you to compare the "real" plant image with the reconstructed 3D model.
- **Navigation**: The interactive slider bar allows you to quickly scrub around acquisition images.

### 4. Data Panels (Right Side)

For quantitative analysis, the explorer provides interactive charts:

- **Angles Panel**: Displays divergence angles between successive organs (phyllotaxy) in degrees.
  It helps identify if the plant follows specific growth patterns (like the golden angle of 137.5°).
  Hovering points will highlight the corresponding pair of organs in the 3D viewer.
- **Distances Panel**: Shows internode lengths (the distance between successive organs) in millimeters.
  Hovering points will highlight the corresponding pair of organs in the 3D viewer.
- Both can compare automated data against manual measurements to assess the accuracy of the reconstruction algorithms.

### 5. Header & Controls

- **Metadata**: Displays the species name, environment, and capture date of the current scan.
- **Camera Tools**: Quickly switch between perspective and orthographic views or reset the camera to its home position.
- **Help Tooltip**: Provides quick access to keyboard shortcuts and navigation tips.

## Getting Started

We recommend Docker to use this app, but if you wish to develop the app you will need to install is as follows.

### Node.js Environment

The application requires `npm`, which is included with `Node.js`. We recommend using:

- **Node.js** version 10 or higher
- **npm** version 6 or higher

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

#### Start the PlantDB REST API

To test this frontend app, you need first to start the [PlantDB](https://romi.github.io/plantdb/) REST API server.

Assuming you have intalled `plantdb.commons` and `plantdb.server` in a conda environment named
`plantdb`, you may start a test server for development purpose as follows:

```shell
# Activate the conda environment
conda activate plantdb
fsdb_rest_api --test
```

You now have a PlantDB server listening to [http://localhost:5000](http://localhost:5000).

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

Without this configuration, the application defaults to [http://localhost:5000](http://localhost:5000).

> **Notes**:
> - You must run a PlantDB REST API server from the [plantdb repository](https://github.com/romi/plantdb).
> - `start` is an alias, defined in [package.json](package.json) under the `scripts` section, that calls
    `react-scripts start` and automatically set `NODE_ENV=development`.

> **Warning**: For running on bleeding-edge Linux distributions (like Fedora or Arch-based systems),
> see [issue #155](https://github.com/romi/plant-3d-explorer/issues/155). `plant-3d-explorer`
>

#### Production Build

Create an optimized production build:

``` bash
npm run build
```

This generates production-ready files in the `build` folder with minified code and hashed filenames.

> **Notes**:
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

> **Note**:
> Docker Compose must be installed.
> See [installation instructions](https://docs.docker.com/compose/install/).

### Using Pre-built Images

``` bash
export ROMI_DB=<path/to/db> && \
docker compose -f ./docker/docker-compose.yml up
```

> **Important**:
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
  -c "umask 0002 && npm install docz docz-theme-default --dev && npm run docz:build"
```

For more information on using docz, visit the [official documentation](https://docz-v1.surge.sh/).
