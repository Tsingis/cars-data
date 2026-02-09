FROM mcr.microsoft.com/playwright:v1.58.2-noble

WORKDIR /app

RUN corepack enable

COPY app/.npmrc ./
COPY app/package.json ./
COPY app/pnpm-lock.yaml ./
COPY app/src ./src
COPY app/tsconfig.json ./
COPY app/vite.config.ts ./
COPY app/playwright.config.ts ./

RUN pnpm install --ignore-scripts ---ignore-scripts --frozen-lockfile && pnpm run build