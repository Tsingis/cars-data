FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

ARG ENV_FILE=.env

COPY $ENV_FILE ./.env
COPY config/ ./config
COPY src ./src

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]