# 关于平时遇到的一些杂七杂八的问题

## Windows 中的 hosts 文件

### 文件所在位置

win+R 输入 c:\windows\system32\drivers\etc
配置: ip 地址 域名 `xxx.xxx.xxx.xxx xxx.com`

### 作用 1. 加快域名解析作用

经常访问的网站，可以通过 hosts 文件来配置域名以及 IP 之间的关系，提高域名解析速度。主要是因为两者的映射关系，我们输入域名计算机就能很快解析出 IP。而不是在网络上请求服务器。

### 作用 2.方便局域网用户

在很多的局域网中，我们会有很多的服务器提供给用户进行使用。而在局域网中是缺少 DNS 服务器的，那么输入进去的 IP 地址就很难记住。hosts 文件则是能够有效减少这样的麻烦，方便用户使用。

### 作用 3.屏蔽网站

在很多的网站中，我们会看见很多没有经过用户同意就安装上去的插件。在这些插件中存在木马病毒的可能性很大，使用 hosts 文件可以将错误 IP 映射到本地 IP 之中，将网站屏蔽。

## 获取用户 ip 地址、设备信息、浏览器信息

结论：前端无法获取，一般是后端获取。
现在项目一般都是前后端分离的项目，在用户请求的时候，nginx 代理里面会有`proxy_set_header X-Real-IP $remote_addr;`、`proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;`这两个配置，nginx 会将用户的真实 ip 地址放到请求头中，后端取的时候就得取这两个字段；至于设备信息、浏览器信息，浏览器会自动放到请求头中的`user-agent`字段中，后端取的时候就得取这个字段。

## vm 虚拟机

参考教程：https://juejin.cn/post/7245838232012357692?searchId=20240913093212A77A3D04DE8DF171573B

## 测试安全问题

1. 后端返回数据中不能存在敏感信息，比如用户密码、用户手机号、用户身份证号等。
   - 后端将数据转为了 base64 编码，前端解码后显示。
   ```js
   window.atob("需要转码的字符串");
   ```
2. gitlab token 过期
   - 重新生成 token，在 gitlab 的设置中，可以找到个人访问令牌，重新生成即可。
   - 修改 gitlab 的远程仓库地址，将 token 添加到地址中。
   ```shell
   git remote set-url origin https://用户名:个人令牌token@git.qualink.com/xxx/xxx.git
   ```

## 渲染内容时有时候数字不会自动换行，需要手动添加 css 样式

```tsx
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cname(
      "text-center text-sm text-gray-800 text-muted-foreground",
      className
    )}
    style={{ wordBreak: "break-word" }} // 添加这一行自动换行
    {...props}
  />
));
```

## MIME 类型无法读取

在项目中进行文件上传时遇到这样一个问题，后端需要添加文件类型校验，用的是`MIME`类型，但是前端上传的 markdown 文件类型是`application/octet-stream`，导致后端无法读取文件类型，后端返回`MIME`类型错误。
尝试直接在`headers: { 'Content-Type': 'text/markdown;charset=utf-8' }`,但是还是不行，后端返回`MIME`类型错误。（后端是开放了`text/markdown`）
最后解决：把文件转为 blob 对象，设置`type`为`text/markdown`，再上传。

```js
if (file.name.includes(".md") || file.name.includes(".MD")) {
  formData.set("file", new Blob([file], { type: "text/markdown" }), file.name);
} else {
  formData.append("file", file);
}
```

后面查了一下，formData 的格式是`multipart/form-data`，本身就是用来上传二进制数据的，不支持直接修改类型；直接 append('Content-Type', 'text/markdown;charset=utf-8')，相当于给了整个表单添加了类型，后端无法识别。
而 blob 可以将文件转为二进制数据，blob.type，表明该 Blob 对象所包含数据的 MIME 类型。如果类型未知，则该值为空字符串
在有些版本浏览器 blob 对象可能没有名字，一般情况是默认为`blob`，所以需要手动设置名字。而 formData.set('键名'，'值'，'文件名')，可以设置文件名。

## 提交规范

- fix: 修复 bug
- feat: 新功能
- updated: 更新功能
- docs: 文档更新
- style: 代码格式（不影响代码运行的变动）
- refactor: 重构（即不是新增功能，也不是修改 bug 的代码变动）
- perf: 性能优化
- test: 增加测试
- build: 构建流程、外部依赖变更（例如 webpack、npm 等）的修改
- revert: 回滚到上一个版本

## 加载聊天数据

会话过程中，有需要加载历史记录的场景，直接加载数据时，如果会话会在数据库添加新的数据，会导致加载的数据和会话中的数据不一致，所以这时候分页不能使用页码，而是使用一个递增的 id，确保每次上滚请求数据时，都能从当前条数据往上取，不会因为数据库中添加了新的数据导致数据不一致。

## 会话过程中使用 websocket

websocket 用于实时通信，保持和后端的长连接；实现实现过程中需要实现断线重连，心跳检测，消息去重等功能。
消息去重：将发送时生成的UUID作为唯一标识，接收时判断是否重复。
心跳检测：ws 长连接创建定时像服务端发送心跳包，服务端收到返回确认信息，如果超过一定时间没有收到心跳包，则断开连接，客户端重新连接。
断线重连：客户端在断开连接后，自动重新连接，重连次数限制 3 次，超过 3 次则提示用户。
还有就是onmessage收到消息需要对数据进行处理，判断数据是否是流式等
以及判断会话id，拦截掉其他会话的消息，避免会话串台。

## github pages部署文件deploy.yml
使用的时候遇到一个问题，以前部署的时候是npm作为包管理器，然后改成pnpm后生成的pnpm-lock.yaml文件，github pages无法识别，导致无法部署

## 删除本地现有的远程分支
git remote remove origin

## 响应头设置：Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
这是当浏览器请求该接口后，该网页再次请求服务器会把所有的请求都强制变为https协议
max-age 表示在后面的31536000秒的时间内，浏览器再请求这个域名的时候，都会使用https请求
includeSubDomains 表示所有子域名也使用https
preload 表示在浏览器预加载列表中添加该域名，这样在浏览器中访问该域名时，会自动使用https协议（在第一次使用该网站的时候就会使用https，而不是在下一次开始）