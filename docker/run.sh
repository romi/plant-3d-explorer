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
  ${api_url}
  "

  echo "OPTIONS:"
  echo "  -t, --tag
    Docker image tag to use, default to '${vtag}'."
  echo "  --api_url
    REACT API URL to use to retrieve dataset, default is '${api_url}'.
    Set it to '127.0.0.0:5000' if you have a local plantdb instance running."
  echo "  -c, --cmd
    Defines the command to run at container startup.
    By default it starts the Plant 3D Explorer listening to the given API URL."
  echo "  -p, --port
    Port to expose, default is '${port}'."
  echo "  -v, --volume
    Volume mapping between host and container to mount a local directory in the container." \
    "Absolute paths are required and multiple use of this option is allowed." \
    "For example '-v /host/dir:/container/dir' makes the '/host/dir' directory accessible under '/container/dir' within the container."
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
  -v | --volume)
    shift
    if [ "${mount_option}" == "" ]; then
      mount_option="-v $1"
    else
      mount_option="${mount_option} -v $1" # append
    fi
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

# Check if we have a TTY or not
if [ -t 1 ]; then
  USE_TTY="-t"
else
  USE_TTY=""
fi

# Docker commands based on : https://mherman.org/blog/dockerizing-a-react-app/#docker
if [ "${cmd}" = "" ]; then
  # Start in interactive mode, using the `-i` flag (load `~/.bashrc`).
  docker run --rm ${mount_option} \
    --env CHOKIDAR_USEPOLLING="true" \
    --env REACT_APP_API_URL="${api_url}" \
    -p ${port}:${port} \
    -i ${USE_TTY} \
    roboticsmicrofarms/plant-3d-explorer:${vtag}
    # --rm : Remove container after closing
    # -v ${PWD}:/app : Mount the app folder
    # -v /app/node_modules : Mount the node modules
    # -e CHOKIDAR_USEPOLLING="true" : Allow hot-reload
else
  # Start in interactive mode, using the `-i` flag (load `~/.bashrc`).
  docker run --rm ${mount_option} \
    --env REACT_APP_API_URL="${api_url}" \
    -p ${port}:${port} \
    -i ${USE_TTY} \
    roboticsmicrofarms/plant-3d-explorer:${vtag} \
    bash -c "${cmd}"
fi
