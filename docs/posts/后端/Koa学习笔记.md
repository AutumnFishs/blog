---
title: Koa学习笔记
abstract: koa 是 一款基于 node.js 的 web 应用框架，它的特点是轻量、简单、易用、扩展性强，最主要的是通过洋葱圈模型对中间件进行管理，使代码逻辑更加清晰，易于维护。koa 比 express 更轻量，需要手动引入自己需要的中间件，本身 koa 也是 express 团队开发的，两者比较相似，过渡起来比较容易。
date: 2024-11-09
tags: [Koa]
---
# koa 的 入门笔记
koa 是 一款基于 node.js 的 web 应用框架，它的特点是轻量、简单、易用、扩展性强，最主要的是通过洋葱圈模型对中间件进行管理，使代码逻辑更加清晰，易于维护。koa 比 express 更轻量，需要手动引入自己需要的中间件，本身 koa 也是 express 团队开发的，两者比较相似，过渡起来比较容易。

## koa快速使用

1. 先全局安装 koa2 koa-generator

```sh
npm i -g koa2 koa-generator
```

2. 通过 koa2 创建 项目

```sh
koa2 项目名称
```

3. 项目的基本结构

```js
|-- app.js // 入口文件 路由中间件等配置
|-- package.json // 项目依赖
|-- bin // 启动文件 www配置了启动的各种配置
|-- public // 静态资源
|-- routes // 路由 一般用来写各种接口等
|-- views // 模板 一般用不到，选择用前端代码打包构建产物
```

4. 启动项目

```sh
npm run dev
```

5. 访问项目

```sh
http://localhost:3000
```

## koa 的基本内容

1. 路由

```js
const Koa = require("koa"); // 引入 koa
const Router = require("koa-router"); // 引入 koa-router
const app = new Koa(); // 创建 koa 实例

// 启动服务
app.listen(3000, () => {
  console.log("server is running at http://localhost:3000");
});
```

2. 中间件

```js
// app.js
const Koa = require("koa");
const app = new Koa();
const views = require("koa-views"); // 引入 koa-views
const json = require("koa-json"); // 引入 koa-json 统一json 格式
const onerror = require("koa-onerror"); // 引入 koa-onerror 错误处理
const bodyparser = require("koa-bodyparser"); // 引入 koa-bodyparser 解析请求体，比如post请求的数据
const logger = require("koa-logger"); // 引入 koa-logger 日志记录
const cors = require('@koa/cors'); // 如果需要跨域支持，引入 koa-cors

// 引入路由
const index = require("./routes/index");
const users = require("./routes/users");

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);

app.use(cors());
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;
```
