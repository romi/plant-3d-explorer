FROM ubuntu:18.04
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"
# To build docker image run following command from 'docker/' folder:
# $ docker build -t visualizer Visualizer/
# To start built docker image:
# $ docker run -it -p 3000:3000 visualizer
# To clean-up after build:
# $ docker rm $(docker ps -a -q)
ENV LANG=C.UTF-8
ENV PYTHONUNBUFFERED=1

# Set non-root user name:
ENV SETUSER=romi

USER root
# Change shell to 'bash', default is 'sh'
SHELL ["/bin/bash", "-c"]
# Update package manager & install requirements:
RUN apt-get update && \
    apt-get install -yq --no-install-recommends \
    git ca-certificates \
    npm && \
    npm install npm@latest -g && \
    apt-get clean && \
    apt-get autoremove && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m ${SETUSER} && \
    cd /home/${SETUSER} && \
    mkdir project && \
    chown -R ${SETUSER}: /home/${SETUSER}

# Change user
USER ${SETUSER}
# Change working directory:
WORKDIR /home/${SETUSER}/project

RUN git clone https://github.com/romi/3d-plantviewer.git && \
    cd 3d-plantviewer && \
    # Install modules listed as dependencies in `package.json`:
    npm install && \
    # Link the docker image to romi database:
    echo "REACT_APP_API_URL='https://db.romi-project.eu'" > .env.local

WORKDIR /home/${SETUSER}/project/3d-plantviewer

CMD ["/bin/bash", "-c", "npm start"]