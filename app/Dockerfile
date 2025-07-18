FROM node:22-alpine AS build

WORKDIR /app

ENV NO_UPDATE_NOTIFIER=true

COPY package*.json ./
COPY .npmrc ./

RUN npm ci

ARG DATA_URL

ENV VITE_DATA_URL=${DATA_URL}

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY vite.config.ts ./vite.config.ts

RUN sed -i "s|__DATA_URL__|${DATA_URL}|g" src/public/insert-links.js

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.29-alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

ARG PORT

RUN sed -i "s|__PORT__|${PORT}|g" /etc/nginx/nginx.conf

EXPOSE ${PORT}

CMD ["nginx", "-g", "daemon off;"]