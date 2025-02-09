# Reworked original image based on https://mherman.org/blog/dockerizing-a-react-app/#docker
FROM node:10
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ARG API_URL='https://db.romi-project.eu'
ENV PATH=/app/node_modules/.bin:$PATH
ENV REACT_APP_API_URL=$API_URL

# I have no clue why, but without this line, everything is broken
ENV NODE_PATH=src/

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --only=production
#RUN npm install
RUN npm install react-scripts@3.4.1 -g

COPY . ./

CMD ["npm", "start"]