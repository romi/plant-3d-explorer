# Stage 1: Build the application
FROM node:10 AS build
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

# Define the PlantDB REST API URL as a build argument
ARG API_URL='https://db.romi-project.eu'
# Define the service basename as a build argument
ARG BASENAME='/'
# Set the React app environment variable for API URL
ENV REACT_APP_API_URL="$API_URL"
# Set the React app environment variable for basename
ENV REACT_APP_BASENAME="$BASENAME"

# Update the PATH to include node_modules/.bin
ENV PATH="/app/node_modules/.bin:$PATH"
 Set the NODE_PATH to point to the source directory
ENV NODE_PATH="src/"
# Set the working directory to /app
WORKDIR /app

# Copy package.json & package-lock.json to the current directory
COPY package.json ./
COPY package-lock.json ./

# Install production dependencies using npm ci
RUN npm ci --only=production
# Globally install a specific version of react-scripts
RUN npm install react-scripts@3.4.1 -g

# Copy all files from the host to the container's working directory
COPY . ./
# Build the React application
RUN npm run build

# Stage 2: Serve the application using an alpine-based nginx image
FROM nginx:alpine

# Copy the built application from the previous stage to the nginx default HTML directory
COPY --from=build /app/build /usr/share/nginx/html
# Copy custom nginx configuration
COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf
# Expose port 80 for HTTP traffic
EXPOSE 80
# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]