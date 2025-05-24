FROM mcr.microsoft.com/playwright:v1.52.0-noble

RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /testing

COPY util/http_server.py ./util/http_server.py
COPY data/data.json ./data/data.json

WORKDIR /testing/app

COPY app/package*.json ./
COPY app/.npmrc ./
COPY app/src ./src
COPY app/tsconfig.json ./
COPY app/vite.config.ts ./
COPY app/playwright.config.ts ./

RUN npm ci && npm run build

COPY app/tests/playwright ./tests/playwright

CMD ["npm", "run", "playwright"]