FROM node:22 AS builder
WORKDIR /app

ARG API_PUBLIC_URL=http://localhost
ARG API_PUBLIC_PORT=3000
ENV API_PUBLIC_URL=$API_PUBLIC_URL
ENV API_PUBLIC_PORT=$API_PUBLIC_PORT

COPY package*.json ./
RUN npm install

COPY . .

# Build dashboard directly with vite
RUN cd apps/admin-dashboard && npx vite build --outDir /app/dist/apps/admin-dashboard

# Build server — skip custom package executor, just build-app + migrations
RUN npx nx run server:build-app
RUN npx nx run server:transpile-migrations

FROM node:22-slim
WORKDIR /app

# Install only production deps in final image
COPY package*.json ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/dist/apps/server ./dist/apps/server
COPY --from=builder /app/dist/apps/admin-dashboard ./dist/apps/admin-dashboard
COPY --from=builder /app/dist/migrations ./dist/migrations

EXPOSE 3500
CMD ["node", "dist/apps/server/main.js"]
