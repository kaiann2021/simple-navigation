# 静态站点构建与部署指南

## 1. 准备工作

本项目是一个 Next.js 应用。为了将其部署为纯静态文件（不需要 Node.js 服务器），我们需要进行静态导出配置。

**注意：** 我已经自动为您修改了 `next.config.mjs` 文件，开启了 `output: 'export'` 选项。

## 2. 构建静态文件

在您的本地终端中（VS Code 终端），请执行以下命令来安装依赖并构建项目：

```bash
# 1. 安装依赖 (如果您还没有安装)
# 既然项目中存在 pnpm-lock.yaml，推荐使用 pnpm，如果没有安装 pnpm，npm 也可以。
npm install
# 或者
pnpm install

# 2. 构建项目
npm run build
```

构建成功后，项目根目录下会生成一个 **`out`** 文件夹。这个文件夹包含了所有的 HTML、CSS 和 JavaScript 文件，可以直接部署到任何静态文件服务器。

## 3. 部署到 Nginx

将 `out` 文件夹中的所有内容上传到您的服务器（例如 `/var/www/navigation`）。

### Nginx 配置示例

编辑您的 Nginx 配置文件（通常位于 `/etc/nginx/sites-available/default` 或 `/etc/nginx/conf.d/your-site.conf`）：

```nginx
server {
    listen 80;
    server_name your-domain.com;  # 将此处替换为您的域名或 IP

    # 指向上传的 out 文件夹路径
    root /var/www/navigation;
    index index.html;

    # 核心配置：支持静态文件路由
    location / {
        # 尝试查找对应的文件
        # 1. $uri: 查找精确匹配的文件 (如 /favicon.ico)
        # 2. $uri.html: 查找对应的 HTML 文件 (Next.js 导出后，/about 会对应 /about.html)
        # 3. $uri/: 查找目录 (对应 /blog/index.html 这种情况)
        try_files $uri $uri.html $uri/ =404;
    }

    # 可选：开启 gzip 压缩加速加载
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 部署步骤

1.  **上传文件**：
    使用 SCP 或 SFTP 将本地 `out` 目录的内容复制到服务器目录。
    ```bash
    # 示例 (在本地执行)
    scp -r out/* root@your-server-ip:/var/www/navigation
    ```

2.  **重启 Nginx**：
    在服务器上执行：
    ```bash
    # 检查配置语法是否正确
    sudo nginx -t
    
    # 重载配置
    sudo systemctl reload nginx
    ```

现在，访问您的域名或 IP 即可看到导航页。
