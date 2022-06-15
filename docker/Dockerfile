# Reworked original image based on https://mherman.org/blog/dockerizing-a-react-app/#docker
FROM node:10
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ARG API_URL='https://db.romi-project.eu'
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./

# Link the docker image to romi database:
ENV REACT_APP_API_URL=$API_URL

CMD ["npm", "start"]