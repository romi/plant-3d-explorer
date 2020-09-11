#!/bin/bash

###############################################################################
# Example usages:
###############################################################################
# 1. Default run starts an interactive shell:
# $ ./run.sh

vtag="latest"
api_url='https://db.romi-project.eu'

usage() {
  echo "USAGE:"
  echo "  ./run.sh [OPTIONS]
    "

  echo "DESCRIPTION:"
  echo "  Run 'roboticsmicrofarms/plantviewer:<vtag>' container with a mounted local (host) database.
    "

  echo "OPTIONS:"
  echo "  -t, --tag
    Docker image tag to use, default to '$vtag'.
    "
  echo "  --api_url
    REACT API URL to use to retrieve dataset, default is '$api_url'.
    "

  echo "  -h, --help
    Output a usage message and exit.
    "
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
    -it roboticsmicrofarms/plantviewer:$vtag
else
  docker run \
    -it roboticsmicrofarms/plantviewer:$vtag
fi


