#!/bin/bash

vtag="latest"
api_url='https://db.romi-project.eu'
docker_opts=""

usage() {
  echo "USAGE:"
  echo "  ./build.sh [OPTIONS]
    "

  echo "DESCRIPTION:"
  echo "  Build a docker image named 'roboticsmicrofarms/plant-3d-explorer' using Dockerfile in same location.
  It must be run from the 'plant-3d-explorer' repository root folder!
  "

  echo "OPTIONS:"
  echo "  -t, --tag
    Docker image tag to use, default to '$vtag'."
  echo "  --api_url
    REACT API URL to use to retrieve dataset, default is '$api_url'."
  # -- Docker options:
  echo "  --no-cache
    Do not use cache when building the image, (re)start from scratch."
  echo "  --pull
    Always attempt to pull a newer version of the parent image."
  echo "  --plain
    Plain output during docker build."
  # General options:
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
  --no-cache)
    shift
    docker_opts="$docker_opts --no-cache"
    ;;
  --pull)
    shift
    docker_opts="$docker_opts --pull"
    ;;
  --plain)
    docker_opts="${docker_opts} --progress=plain"
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

# Get the date to estimate docker image build time:
start_time=$(date +%s)

# Start the docker image build:
docker build -t roboticsmicrofarms/plant-3d-explorer:$vtag $docker_opts -f docker/Dockerfile .

# Important to CI/CD pipeline to track docker build failure
docker_build_status=$?
if [ $docker_build_status != 0 ]; then
  echo "docker build failed with $docker_build_status code"
fi

# Print docker image build time:
echo
echo Build time is $(expr $(date +%s) - $start_time) s

exit $docker_build_status
