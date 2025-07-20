FROM mcr.microsoft.com/playwright:v1.54.1-noble

WORKDIR /app

COPY app/.npmrc ./

RUN npm install -g pnpm

COPY app/package.json ./
COPY app/pnpm-lock.yaml ./
COPY app/src ./src
COPY app/tsconfig.json ./
COPY app/vite.config.ts ./
COPY app/playwright.config.ts ./

RUN pnpm install --frozen-lockfile && pnpm run build

CMD ["pnpm", "run", "playwright"]