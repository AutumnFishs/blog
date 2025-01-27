---
title: Nest项目中集成Prisma
date: 2025-01-26
tags: [NestJS,Prisma]
abstract: Prisma 是一款先进的数据库工具，旨在简化数据库操作流程，使得开发者无需手动编写 SQL 语句即可高效地与数据库交互。通过 Prisma 提供的直观 API，可以轻松执行各种数据库操作，如创建、读取、更新和删除（CRUD）数据，并且它还支持类型安全，特别是在使用 TypeScript 时，能够有效提升代码的质量和可靠性。
---
# Nest项目中集成Prisma

### 步骤一：初始化 NestJS 项目
首先，确保已经有一个nestjs项目，或者创建一个nestjs项目
```bash
nest new project_name
```

### 步骤二：安装 Prisma
安装 Prisma 相关依赖：
```bash
cd project_name
npm install @prisma/client 
npx prisma init

# 安装prisma（脚手架依赖），用于提供命令行指令（可选）
npm install -D prisma
npx prisma init 
```
`npx prisma init` 命令会在项目中创建一个 `prisma` 文件夹，里面包含了一个初始的 Prisma Schema 文件和一个 `.env` 文件用于配置数据库连接。生成的内容如下：
``` js
generator client {
  provider = "prisma-client-js"
}

// 配置数据库类型和连接地址
datasource db {
    //这里我使用的是mysql，默认postgresql
  provider = "mysql" 
  // 这行使用的是 dotenv 获取数据库路径
  url      = env("DATABASE_URL")
}

// Prisma schema file
// 定义用户模型，用来生成数据库表，这里生成了一个User表
model User {
  id        Int      @id @default(autoincrement()) // 用户ID，自动递增
  username  String   // 用户名
  password  String   // 密码
  status    Int      @default(1) // 用户状态，默认为1
  createTime DateTime @default(now()) // 创建时间，默认为当前时间
  updateTime DateTime @default(now()) // 创建时间，默认为当前时间
}

```
`.env`文件中的内容如下：
```sh
# URL接口 db://username:passwod@host:post/表名
DATABASE_URL="mysql://root:admin123@localhost:3306/blog"
```

### 步骤三：生成 Prisma Client 并迁移数据库
运行以下命令生成 Prisma Client 并应用任何待处理的数据库迁移：
```bash
# 重新生成Prisma CLient
npx prisma generate
# 用于在开发过程中生成和应用数据库模式变化的记录（即迁移）
npx prisma migrate dev --name init
```

### 步骤四：在 NestJS 中使用 Prisma Client
1. 首先，在项目中创建一个服务prisma.service.ts
``` ts
import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // 在模块初始化时连接到数据库
  async onModuleInit() {
    await this.$connect();
  }

  // 启用关闭钩子，以便在应用程序关闭时断开数据库连接
  async enableShutdownHooks(app: INestApplication) {
    this.$on(
      // 使用类型断言来绕过类型检查
      'beforeExit' as unknown as Parameters<PrismaClient['$on']>[0],
      async () => {
        // 关闭应用程序
        await app.close();
      },
    );
  }
}
```
2. 在根模块中注入
``` ts
@Module({
    //...
  providers: [AppService, PrismaService],
})
export class AppModule {}
```
3. 在模块中使用操作数据,例如user模块中使用User表
``` ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // 创建新用户
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
  
  // 根据用户ID获取用户信息
  async getUser(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  // 更新用户信息
  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.prisma.user.update({
      data,
      where,
    });
  }

  // 删除用户
  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  // 获取所有用户
  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  // 其他...，以上这些操作api都是prisma中提供的
}

```

### 关于 Prisma 使用时返回数据类型
这里使用User表时，返回的数据类型可以使用如下这种方式
``` ts
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

    //这里用创建和获取举例，其他类型推断一样
  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.getUser(Number(id));
  }
  // ...
}

```
### 结尾
暂时先临时记录一下，后续补充...