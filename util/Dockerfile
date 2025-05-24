FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /testing

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