FROM mcr.microsoft.com/playwright:v1.56.0-noble

WORKDIR /app

RUN corepack enable

COPY app/.npmrc ./
COPY app/package.json ./
COPY app/pnpm-lock.yaml ./
COPY app/src ./src
COPY app/tsconfig.json ./
COPY app/vite.config.ts ./
COPY app/playwright.config.ts ./

RUN pnpm install --frozen-lockfile && pnpm run build