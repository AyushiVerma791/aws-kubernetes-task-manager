# Build stage
FROM node:18-slim AS builder
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

# Production stage
FROM node:18-slim
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/prisma ./prisma

# Change ownership to node user
RUN chown -R node:node /usr/src/app

USER node

EXPOSE 3000

CMD ["npm", "start"]
