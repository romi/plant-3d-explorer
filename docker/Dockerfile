# Reworked original image based on https://mherman.org/blog/dockerizing-a-react-app/#docker
FROM node:10
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ARG API_URL='https://db.romi-project.eu'
ENV REACT_APP_API_URL=$API_URL
ARG BASENAME='/'
ENV REACT_APP_BASENAME=$BASENAME
# Set PUBLIC_URL to match BASENAME so assets are prefixed correctly
ENV PUBLIC_URL=$BASENAME

ENV PATH="/app/node_modules/.bin:$PATH"
# Old react-scripts setups like ours, need the following line to allow absolute imports
ENV NODE_PATH="src/"

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

# Use a cache mount for npm's cache directory
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production

COPY . ./

CMD ["npm", "start"]