#!/bin/bash

vtag="latest"
api_url='https://db.romi-project.eu'
port=3000
cmd=""

usage() {
  echo "USAGE:"
  echo "  ./run.sh [OPTIONS]
    "

  echo "DESCRIPTION:"
  echo "  Run 'roboticsmicrofarms/plant-3d-explorer' container
  By default, start the container with the shared online database by ROMI:
  $api_url
  "

  echo "OPTIONS:"
  echo "  -t, --tag
    Docker image tag to use, default to '$vtag'."
  echo "  --api_url
    REACT API URL to use to retrieve dataset, default is '$api_url'.
    Set it to 'localhost:5000' if you have a local plantdb instance running."
  echo "  -c, --cmd
    Defines the command to run at container startup.
    By default it starts the Plant 3D Explorer listening to the given API URL."
  echo "  -p, --port
    Port to expose, default is '$port'."
  echo "  -h, --help
    Output a usage message and exit."
}

while [ "$1" != "" ]; do
  case $1 in
  -t | --tag)
    shift
    vtag=$1
    ;;
  -c | --cmd)
    shift
    cmd=$1
    ;;
  --api_url)
    shift
    api_url=$1
    ;;
  -p | --port)
    shift
    port=$1
    ;;
  -h | --help)
    usage
    exit
    ;;
  *)
    usage
    exit 1
    ;;
  esac
  shift
done

# Docker commands based on : https://mherman.org/blog/dockerizing-a-react-app/#docker
if [ "$cmd" = "" ]; then
  # Start in interactive mode:
  docker run \
    -it \
    --rm \ # Remove container after closing
    -v ${PWD}:/app \ # Mount the app folder
    -v /app/node_modules \ # Mount the node modules
    -p $port:$port \ # open port
    -e CHOKIDAR_USEPOLLING="true" \ # Allow hot-reload
    -e REACT_APP_API_URL="$api_url" \
    roboticsmicrofarms/plant-3d-explorer:$vtag
else
  # Start in non-interactive mode (run the command):
  docker run \
    --rm \ # Once the container is closed, delete it
    --env REACT_APP_API_URL="$api_url" \
    -v ${PWD}:/app \ # We mount the app content
    -v /app/node_modules \ # I didnt really get this one, but the tutorial said so
    -p $port:$port \
    roboticsmicrofarms/plant-3d-explorer:$vtag \
    bash -c "$cmd"
fi
