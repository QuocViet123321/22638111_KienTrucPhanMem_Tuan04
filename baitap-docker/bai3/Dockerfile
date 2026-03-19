# Stage 1: build React
FROM node:18-alpine AS builder

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Stage 2: chạy app
FROM node:18-alpine

WORKDIR /app

# cài serve để chạy web
RUN npm install -g serve

# copy build từ stage 1
COPY --from=builder /app/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]