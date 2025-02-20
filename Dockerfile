# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@latest-10

COPY pnpm-lock.yaml package.json ./
RUN pnpm install

COPY . .

# 运行阶段
FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY app.js .

EXPOSE 3123

CMD ["node", "app.js"] 