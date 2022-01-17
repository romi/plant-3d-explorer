FROM node:current-buster-slim
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ENV LANG=C.UTF-8
ENV PYTHONUNBUFFERED=1
ENV USER_NAME=myuser

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
    # Create a non-root user and give it rights over a "myapp" folder:
    adduser --disabled-password ${USER_NAME} && \
    mkdir /myapp && chown -R ${USER_NAME} /myapp

# Change user
USER ${USER_NAME}
# Change working directory:
WORKDIR /myapp
# Copy the package sources:
COPY --chown=${USER_NAME} ./ plant-3d-explorer/
# Install the dependencies and package:
RUN cd plant-3d-explorer && \
    # Install modules listed as dependencies in `package.json`:
    npm install

WORKDIR /myapp/plant-3d-explorer

# Link the docker image to romi database:
ENV REACT_APP_API_URL=$API_URL
EXPOSE $PORT

CMD ["/bin/bash", "-c", "npm start"]