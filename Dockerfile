FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build dashboard directly with vite — explicit outDir avoids Nx path resolution issues
RUN cd apps/admin-dashboard && npx vite build --outDir /app/dist/apps/admin-dashboard

# Build server (webpack + transpile migrations + package executor)
RUN npx nx run server:build --skip-nx-cache

# Install only production deps, clean npm cache in same layer to reduce image size
RUN cd dist/apps/server && npm install --omit=dev --legacy-peer-deps && npm cache clean --force

FROM node:22-slim
WORKDIR /app

COPY --from=builder /app/dist/apps/server ./dist/apps/server
COPY --from=builder /app/dist/apps/admin-dashboard ./dist/apps/admin-dashboard
COPY --from=builder /app/dist/migrations ./dist/migrations

RUN apt-get update && apt-get install -y --no-install-recommends wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app/dist/apps/server

EXPOSE 3500
CMD ["node", "main.js"]
