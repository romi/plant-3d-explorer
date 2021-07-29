#!/bin/bash

###############################################################################
# Example usages:
###############################################################################
# 1. Default build options will create `roboticsmicrofarms/plant_3d_explorer:latest` pointing at ROMI database:
# $ ./build.sh
#
# 2. Build image with 'debug' image tag & another 'plant_3d_explorer' branch options:
# $ ./build.sh -t debug -b 'feature/faster_docker'

user=$USER
uid=$(id -u)
group=$(id -g -n)
gid=$(id -g)
vtag="latest"
branch='master'
api_url='https://db.romi-project.eu'
docker_opts=""

usage() {
  echo "USAGE:"
  echo "  ./build.sh [OPTIONS]
    "
  echo "DESCRIPTION:"
  echo "  Build a docker image named 'roboticsmicrofarms/plant_3d_explorer' using Dockerfile in same location.
    "
  echo "OPTIONS:"
  echo "  -t, --tag
    Docker image tag to use, default to '$vtag'."
  echo "  -u, --user
    User name to create inside docker image, default to '$user'."
  echo "  --uid
    User id to use with 'user' inside docker image, default to '$uid'.
    "
  echo "  -g, --group
    Group name to create inside docker image, default to 'group'.
    "
  echo "  --gid
    Group id to use with 'user' inside docker image, default to '$gid'.
    "
  echo "  -b, --branch
    Git branch to use for cloning 'plant-3d-explorer' inside docker image, default to '$branch'."
  echo "  --api_url
    REACT API URL to use to retrieve dataset, default is '$api_url'."
  # Docker options:
  echo "  --no-cache
    Do not use cache when building the image, (re)start from scratch."
  echo "  --pull
    Always attempt to pull a newer version of the parent image."
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
  -u | --user)
    shift
    user=$1
    ;;
  --uid)
    shift
    uid=$1
    ;;
  -g | --group)
    shift
    group=$1
    ;;
  --gid)
    shift
    gid=$1
    ;;
  -b | --branch)
    shift
    branch=$1
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
start_time=`date +%s`

# Start the docker image build:
docker build -t roboticsmicrofarms/plant_3d_explorer:$vtag $docker_opts \
  --build-arg USER_NAME=$user \
  --build-arg USER_ID=$uid \
  --build-arg GROUP_NAME=$group \
  --build-arg GROUP_ID=$gid \
  --build-arg BRANCH=$branch \
  --build-arg API_URL=$api_url \
  .

# Print docker image build time:
echo
echo "Build time: $(expr `date +%s` - $start_time)s"
