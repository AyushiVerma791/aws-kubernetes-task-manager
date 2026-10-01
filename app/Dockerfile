# Build stage
FROM node:20-slim AS builder
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate

# Production stage
FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Only copy necessary files for production
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --omit=dev

# Copy generated Prisma client from builder
COPY --from=builder /usr/src/app/node_modules/@prisma ./node_modules/@prisma

# Copy application source
COPY --from=builder /usr/src/app/src ./src

# Change ownership to node user
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

# Use node directly for graceful shutdown
CMD ["node", "src/server.js"]
