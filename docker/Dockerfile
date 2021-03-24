FROM node:current-buster-slim
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ENV LANG=C.UTF-8
ENV PYTHONUNBUFFERED=1

# Set non-root user name:
ARG USER_NAME=scanner
ARG BRANCH=master
ARG API_URL='https://db.romi-project.eu'
ARG PORT=3000

USER root
# Change shell to 'bash', default is 'sh'
SHELL ["/bin/bash", "-c"]
# Update package manager & install requirements:
RUN apt-get update && \
    apt-get install -yq --no-install-recommends git ca-certificates && \
    apt-get clean -y && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    useradd -m ${USER_NAME} && \
    cd /home/${USER_NAME} && \
    chown -R ${USER_NAME}: /home/${USER_NAME}

# Change user
USER ${USER_NAME}
# Change working directory:
WORKDIR /home/${USER_NAME}

RUN git clone --branch $BRANCH https://github.com/romi/plant-3d-explorer.git && \
    cd plant-3d-explorer && \
    # Install modules listed as dependencies in `package.json`:
    npm install

WORKDIR /home/${USER_NAME}/plant-3d-explorer

# Link the docker image to romi database:
ENV REACT_APP_API_URL=$API_URL
EXPOSE $PORT

CMD ["/bin/bash", "-c", "npm start"]