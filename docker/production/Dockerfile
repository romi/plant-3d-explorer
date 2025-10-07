# ============= Builder stage =============
FROM node:10-alpine AS builder
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

# Set the working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Set environment variables for the build
ARG API_URL='http://localhost:5000'
# Define the service basename as a build argument
ARG BASENAME='/p3dx'
# Set the React app environment variable for API URL
ENV REACT_APP_API_URL="${API_URL}"
# Set the React app environment variable for basename
ENV REACT_APP_BASENAME="${BASENAME}"

# Update the PATH to include node_modules/.bin
ENV PATH="/app/node_modules/.bin:$PATH"
ENV NODE_PATH="src/"

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# ============= Final stage =============
# Serve the built React application using Nginx
FROM nginx:alpine AS runtime

# Set the React app environment variable for API URL
ENV REACT_APP_API_URL="${API_URL:-http://localhost:5000}"
# Set the React app environment variable for basename
ENV REACT_APP_BASENAME="${BASENAME:-/p3dx}"

COPY --from=builder /app/build /usr/share/nginx/html
# Copy custom Nginx configuration file (if needed)
COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]