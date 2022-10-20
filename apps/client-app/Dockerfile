# syntax=docker/dockerfile:1

# Stage 1 - the build process
FROM node:18 as build-deps

WORKDIR /app

COPY package*.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

ENV NODE_ENV=production

RUN yarn build:client-app --configuration=production

# Stage 2 - the production environment
FROM nginx:1.23-alpine
COPY --from=build-deps /app/dist/apps/client-app/exported /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
