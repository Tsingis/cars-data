FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

ARG DATA_URL

ENV VITE_DATA_URL=${DATA_URL}

COPY src ./src
COPY tsconfig.json ./tsconfig.json
COPY vite.config.ts ./vite.config.ts

RUN sed -i "s|__DATA_URL__|${DATA_URL}|g" src/public/insert-links.js

RUN npm run build

FROM nginxinc/nginx-unprivileged:1.27-alpine-slim

COPY --from=build /app/dist /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]