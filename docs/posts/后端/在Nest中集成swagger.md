---
title: 在Nest中集成swagger
date: 2025-01-26
abstract: swagger是一个用来快速生成接口文档的工具，nestjs中同样支持swagger，集成后可以在开发的同时快速完成接口文档的编写。
tags: [Swagger,接口文档]
---
 
# 在Nest中集成swagger

## 步骤一：在Nest项目中安装相关的依赖
这里默认已经创建好了项目，直接安装依赖；swagger-ui-express用来快速生成ui界面，@nestjs/swagger是用来接入nest项目的，提供各种装饰器，方便在nestjs项目中快速使用
``` sh
pnpm i @nestjs/swagger swagger-ui-express
```
## 步骤二：在入口文件中引入中间件
``` ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger配置
  const config = new DocumentBuilder()
    .setTitle('接口文档')// 标题
    .setDescription('API文档')// 接口文档说明
    .setVersion('1.0')// 版本号
    .addBearerAuth()// 添加Bearer Token认证支持
    .build();// 构建
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);//生成文档接口地址

  await app.listen(process.env.PORT ?? 5000, () => {
    console.log(`http://127.0.0.1:${process.env.PORT ?? 5000}`);
  });
}
bootstrap();
```
## 步骤三：在模块中使用swagger生成接口文档
需要注意的是，接口说明一般在controller控制器中添加（也就是接口路由中添加）。同样以user模块为例：
``` ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { ApiTags, ApiResponse, ApiOperation, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })//接口标题
  @ApiResponse({ status: 201, description: '用户创建成功' })//返回信息
  @ApiBody({ description: '用户创建信息', type: CreateUserDto })//body接收参数
  async createUser(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse({ status: 200, description: '返回用户信息' })
  @ApiParam({ name: 'id', required: true, description: '用户ID' })//param接受参数
  async getUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.getUser(Number(id));
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '用户信息更新成功' })
  @ApiParam({ name: 'id', required: true, description: '用户ID' })
  @ApiBody({ description: '更新用户信息', type: UpdateUserDto })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDto,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }
  // ...
}

```

## 装饰器说明
- @ApiTags('用户管理')：用于定义控制器所属的标签，方便在swagger中分类展示
- @ApiOperation({ summary: '创建用户' })：用于定义接口的描述信息
- @ApiResponse({ status: 200, description: '用户创建成功' })：用于定义接口的响应信息
- @ApiParam({ name: 'id', required: true, description: '用户ID' })：用于定义接口的请求参数信息
- @ApiBody({ description: '创建用户', type: CreateUserDto })：用于定义接口的请求体信息
- @ApiProperty：用于定义DTO中的必选属性信息
- @ApiPropertyOptional：用于定义DTO中的可选属性信息
  - @ApiProperty({ description: '文章标题' })
  - @ApiPropertyOptional({ description: '文章内容' })


## 结尾
swagger也支持按模块生成，后续补充...