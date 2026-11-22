FROM node:20-alpine

# Prisma cần OpenSSL để chạy query engine trên Alpine
RUN apk add --no-cache openssl

WORKDIR /app

# Cài dependencies trước để tận dụng cache của Docker
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Sinh Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Chạy migration rồi khởi động server
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
