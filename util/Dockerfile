FROM mcr.microsoft.com/playwright:v1.54.0-noble

WORKDIR /app

COPY app/package*.json ./
COPY app/.npmrc ./
COPY app/src ./src
COPY app/tsconfig.json ./
COPY app/vite.config.ts ./
COPY app/playwright.config.ts ./

RUN npm ci && npm run build

CMD ["npm", "run", "playwright"]