# 第一阶段：构建应用
FROM node:18-alpine AS blog_build

# 安装 git
RUN apk add --no-cache git

# 验证 git 安装
RUN git --version

# 设置工作目录
WORKDIR /app

# 复制所有文件到工作目录
COPY . /app

# 安装 pnpm 并安装依赖，构建文档
RUN npm install -g pnpm && \
    pnpm install --force && \
    pnpm docs:build

# 第二阶段：创建 Nginx 服务器
FROM nginx

# 将构建好的文档复制到 Nginx 的静态文件目录
COPY --from=blog_build /app/docs/.vitepress/dist /usr/share/nginx/html

# 复制 Nginx 配置文件(这里没有后端暂时不需要配置nginx反向代理)
# COPY /nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口（声明容器运行时监听的特定网络端口）
EXPOSE 80

# 启动镜像时自动启动Nginx（指定容器创建时的默认命令）
CMD ["nginx", "-g", "daemon off;"]