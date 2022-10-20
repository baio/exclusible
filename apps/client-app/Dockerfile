# syntax=docker/dockerfile:1

# Stage 1 - the build process
FROM node:18 as build-deps
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:client-app --configuration=production

# Stage 2 - the production environment
FROM nginx:1.23-alpine
COPY --from=build-deps dist/apps/config-service /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
