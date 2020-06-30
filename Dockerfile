FROM ubuntu:18.04
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ENV LANG=C.UTF-8
ENV PYTHONUNBUFFERED=1

# Set non-root user name:
ENV USER_NAME=scanner

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
    useradd -m ${USER_NAME} && \
    cd /home/${USER_NAME} && \
    mkdir project && \
    chown -R ${USER_NAME}: /home/${USER_NAME}

# Change user
USER ${USER_NAME}
# Change working directory:
WORKDIR /home/${USER_NAME}/project

RUN git clone https://github.com/romi/3d-plantviewer.git && \
    cd 3d-plantviewer && \
    # Install modules listed as dependencies in `package.json`:
    npm install

WORKDIR /home/${USER_NAME}/project/3d-plantviewer

# Link the docker image to romi database:
ENV REACT_APP_API_URL='https://db.romi-project.eu'

CMD ["/bin/bash", "-c", "npm start"]