# Stage 1: Build the React application
FROM node:10-slim AS build-stage

LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

# Set environment variables for build time
ARG API_URL='https://db.romi-project.eu'
ARG BASENAME='/p3dx'
ENV REACT_APP_API_URL=$API_URL
ENV REACT_APP_BASENAME=$BASENAME
ENV PUBLIC_URL=$BASENAME
# Old react-scripts setups like ours, need the following line to allow absolute imports
ENV NODE_PATH="src/"

WORKDIR /app

# Copy dependency files first to leverage Docker layer caching
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDependencies like react-scripts)
# required to run the 'build' script.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY . ./

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine AS runtime

# Remove default nginx config and copy your custom one
COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static build to the path expected by your nginx.conf
# We use a subfolder to match the /p3dx/ alias logic if preferred,
# but usually, we just map the alias to the folder.
COPY --from=build-stage /app/build /usr/share/nginx/html/p3dx

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]