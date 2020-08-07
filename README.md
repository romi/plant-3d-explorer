# 3d Plantviewer

![badge](https://github.com/romi/3d-plantviewer/workflows/Tests/badge.svg)

## Available Scripts
In the project directory, you can run:

### ```npm install```

This is needed to install the dependencies of the project.

To make sure everything works fine, your version of nodejs must be >= 10 and your version of npm must be >= 6.

### ```npm test```

This will run the tests for the project. It will permanently run and run again 
on files when they are changed. Multiple commands are available, see
[this](https://create-react-app.dev/docs/running-tests/) for more info.

Each test file is located with the component it is testing. So the tests for the file `src/ScanList/index.js` are located in `src/Scanlist/index.test.js`.

### ```npm start```

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

You need to add a file `.env.local` at project's root to set the `API URL`:

```
REACT_APP_API_URL='{`API URL}'
```
Whithout this, the app will use `http://localhost:5000`.

To use a local database, you must run the data storage server [from this repository](https://github.com/romi/romidata).

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Docker container

### Build docker image
To build the image, at the root directory of the repo:
```bash
docker build -t roboticsmicrofarms/plantviewer:2.1 .
```
To run it:
```bash
docker run -it -p 3000:3000 roboticsmicrofarms/plantviewer:2.1
```
Once it's up, you should be able to access the viewer here: http://localhost:3000/

**important**:
> Use `chrome` as `firefox` has some issues with the used JavaScript libraries!

Push it on `roboticsmicrofarms` docker hub:
```bash
docker push roboticsmicrofarms/plantviewer:2.1
```
This require a valid account, token and existing repository (`romi_plantviewer`) on docker hub!

### Use pre-built docker image
First you need to pull the docker image:
```bash
docker pull roboticsmicrofarms/romi_plantviewer
```
Then you can run it with:
```bash
docker run -p 3000:3000 roboticsmicrofarms/romi_plantviewer
```


## Docker compose
To use a local database, for testing or development, we provide a docker compose recipe that:

1. start a database container using `roboticsmicrofarms/romidb`
2. start a plantviewer container using `roboticsmicrofarms/plantviewer`

**note**:
> You need `docker-compose` installed, see 
[here](https://docs.docker.com/compose/install/).

### Use pre-built docker image
From the directory containing the `docker-compose.yml` in a terminal:
```bash
export ROMI_DB=<path/to/db>
docker-compose up -d 
```
**important**:
> Do not forget to set the path to the database.
**warning**:
> If you have other containers running it might not work since it assumes the 
romidb container will have the `172.21.0.2` IP address!

To stop the containers: 
```bash
docker-compose stop
```

### Use local builds
To use local builds for development or debugging purposes:

1. build your image following the instructions above and use a specific tag like `debug`
2. edit the `docker-compose.yml` file to add the previously defined tag to the name of the image to start

## Documentation

For general documentation on the whole ROMI project, head over
[here](https://docs.romi-project.eu).

For developer-level documentation for the visualizer, head over
to the [GitHub pages](https://romi.github.io/3d-plantviewer/)
for this repository.


