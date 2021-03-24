#!/bin/bash

vtag="latest"
api_url='https://db.romi-project.eu'
port=3000

usage() {
  echo "USAGE:"
  echo "  ./run.sh [OPTIONS]
    "
  echo "DESCRIPTION:"
  echo "  Start the Plant 3D Explorer container.
  Uses the docker image: 'roboticsmicrofarms/plant_3d_explorer'.
  By default, start the container with the shared online database by ROMI.
    "
  echo "OPTIONS:"
  echo "  -t, --tag
    Docker image tag to use, default to '$vtag'."
  echo "  --api_url
    REACT API URL to use to retrieve dataset, default is '$api_url'.
    Set it to 'localhost:5000' if you have a local PlantDB database running."
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

# Use 'host database path' & 'docker user' to create a bind mount:
if [ "$api_url" != "" ]
then
  docker run \
    --env REACT_APP_API_URL="$api_url" \
    --env PORT=$port \
    -it roboticsmicrofarms/plant_3d_explorer:$vtag
else
  docker run \
    --env PORT=$port \
    -it roboticsmicrofarms/plant_3d_explorer:$vtag
fi


