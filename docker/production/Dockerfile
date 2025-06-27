# Stage 1: Build the application
FROM node:10 as build
LABEL maintainer="Jonathan LEGRAND <jonathan.legrand@ens-lyon.fr>"

ARG API_URL='https://db.romi-project.eu'
ENV REACT_APP_API_URL $API_URL
ENV PATH /app/node_modules/.bin:$PATH
ENV NODE_PATH src/

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --only=production
RUN npm install react-scripts@3.4.1 -g

COPY . ./
RUN npm run build

# Stage 2: Serve the application
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/production/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]