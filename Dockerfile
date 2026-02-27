# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Build Frontend
RUN npm run build

# Build Backend (Compile TS)
# We can use ts-node or compile to JS. Let's compile for production.
RUN npx tsc -p tsconfig.json

# Production Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/prisma ./prisma
# Copy compiled backend if we were compiling, but we are using tsx/ts-node in dev.
# For prod, we should ideally compile. 
# For this example, we will assume we run with ts-node/tsx or similar for simplicity, 
# or we would have a separate build step for server.
# Let's stick to the prompt requirement "Dockerfile backend" and "Dockerfile frontend".
# The prompt asked for separate Dockerfiles or a unified one? 
# "Dockerfile backend", "Dockerfile frontend".
# Okay, I will create two separate Dockerfiles.

# This file will be ignored/replaced by the specific ones below.
