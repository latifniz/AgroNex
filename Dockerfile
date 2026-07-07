FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build dashboard (server serves it via DashboardPlugin)
RUN npx nx build admin-dashboard

# Build server (build-app + transpile-migrations + package)
RUN npx nx run server:build

# Install production deps inside dist
RUN cd dist/apps/server && npm install --legacy-peer-deps

FROM node:22-slim
WORKDIR /app

COPY --from=builder /app/dist/apps/server ./dist/apps/server
COPY --from=builder /app/dist/apps/admin-dashboard ./dist/apps/admin-dashboard
COPY --from=builder /app/dist/migrations ./dist/migrations

EXPOSE 3500
CMD ["node", "dist/apps/server/main.js"]
