# ===== Stage 1 =====
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install

# ===== Stage 2 =====
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000

CMD ["node", "app.js"]