# 从零开始搭建 Hexo 博客

[Hexo](https://hexo.io) 是一款高效、简洁且强大的静态博客框架，广受开发者喜爱。本文将带你从零开始，完成 `Hexo` 博客的安装与部署，轻松创建属于你的个人博客！

## 准备工作

`Hexo` 需要下列程序的支持。请确保你已安装这些程序：

- `Node.js`

  (`Node.js` 版本需不低于 `10.13`，建议使用 `Node.js 12.0` 及以上版本)

- `Git`

如果您的电脑中已经安装了上述程序，您可以直接前往下一节。

## 安装 `Hexo` 脚手架

```bash
~/Desktop/blog
❯ npm install -g hexo-cli

added 54 packages, and audited 55 packages in 8s

14 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

安装完成后，通过 `hexo -v` 检查是否安装成功：

```bash
~/Desktop/blog
❯ hexo -v
hexo-cli: 4.3.2
os: darwin 24.1.0 15.1.1

node: 16.20.2
v8: 9.4.146.26-node.26
uv: 1.49.2
zlib: 1.2.12
brotli: 1.1.0
ares: 1.34.2
modules: 93
nghttp2: 1.64.0
napi: 8
llhttp: 6.0.11
openssl: 3.4.0
cldr: 46.0
icu: 76.1
tz: 2024b
unicode: 16.0
```

## 初始化 `Hexo` 博客

通过终端进入您想要创建博客的文件夹，执行初始化命令：

```bash
~/Desktop/blog
❯ hexo init
INFO  Cloning hexo-starter https://github.com/hexojs/hexo-starter.git
warning hexo > warehouse > cuid@2.1.8: Cuid and other k-sortable and non-cryptographic ids (Ulid, ObjectId, KSUID, all UUIDs) are all insecure. Use @paralleldrive/cuid2 instead.
warning hexo-renderer-marked > jsdom > abab@2.0.6: Use your platform's native atob() and btoa() methods instead
warning hexo-renderer-marked > jsdom > data-urls > abab@2.0.6: Use your platform's native atob() and btoa() methods instead
warning hexo-renderer-marked > jsdom > domexception@4.0.0: Use your platform's native DOMException instead
warning hexo-renderer-stylus > stylus > glob@7.2.3: Glob versions prior to v9 are no longer supported
warning hexo-renderer-stylus > stylus > glob > inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
INFO  Start blogging with Hexo!
```

初始化完成后，文件夹结构如下：

```bash
~/Desktop/blog
❯ tree -L 1
.
├── _config.landscape.yml
├── _config.yml
├── node_modules
├── package.json
├── scaffolds
├── source
├── themes
└── yarn.lock

5 directories, 4 files
```

- _config.yml

  网站的配置文件。您可以在此配置大部分的参数，如网站标题、网站的关键词等。

- package.json

  应用程序的依赖信息。
  包括 `EJS`、`Stylus` 和 `Markdown` 渲染引擎，这些已默认安装。如果不需要，您可以根据需求自由移除它们。

- scaffolds

  模版文件夹。当您新建文章时，`Hexo` 会根据 `scaffold` 来创建文件。

- source

  资源文件夹。用于存放用户资源。除了 `_posts` 文件夹之外，所有以 `_`（下划线）开头的文件/文件夹以及隐藏文件将被忽略。Markdown 和 HTML 文件会被解析并放到 `public` 文件夹，而其他文件会被拷贝过去。

- themes

  主题文件夹。`Hexo` 会根据主题来生成静态页面。

## 预览博客

在终端中，执行 `hexo server` 启动服务器，即可看到你的博客初始界面！

默认情况下，访问网址为：<http://localhost:4000/>。

```bash
❯ hexo server
INFO  Validating config
INFO  Start processing
INFO  Hexo is running at http://localhost:4000/ . Press Ctrl+C to stop.
```

## 部署博客到 GitHub Pages

使用 `GitHub Actions` 将博客部署到 `GitHub Pages`。

**请注意**：在以下步骤中，所有涉及到 GitHub 用户名的地方，请将 `username` 替换为你的 `GitHub` 用户名。

1. 在 `GitHub` 中，创建一个名为 `username.github.io` 的仓库
2. 前往仓库的设置页面，进入 `Settings > Pages`，将 `Source` 中的选项更改为 `GitHub Actions`，然后保存设置
3. 创建 `.github/workflows/pages.yml` 文件，并填入以下内容：

   ```text
   name: Pages

   on:
      push:
         branches:
            - main # default branch

   jobs:
      build:
         runs-on: ubuntu-latest
         steps:
            - uses: actions/checkout@v4
            with:
               token: ${{ secrets.GITHUB_TOKEN }}
               # If your repository depends on submodule, please see: https://github.com/actions/checkout
               submodules: recursive
            - name: Use Node.js 20
            uses: actions/setup-node@v4
            - name: Cache NPM dependencies
            uses: actions/cache@v4
            with:
               path: node_modules
               key: ${{ runner.OS }}-npm-cache
               restore-keys: |
                  ${{ runner.OS }}-npm-cache
            - name: Install Dependencies
            run: npm install
            - name: Build
            run: npm run build
            - name: Upload Pages artifact
            uses: actions/upload-pages-artifact@v3
            with:
               path: ./public
      deploy:
         needs: build
         permissions:
            pages: write
            id-token: write
         environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
         runs-on: ubuntu-latest
         steps:
            - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v4
   ```

4. 将博客文件夹中的文件推送到该仓库
5. 当 action 运行完成后，前往 <https://username.github.io> 查看已部署的博客

### 一键部署

为了方便快捷地将本地博客发布到 `GitHub Pages`，我们可以安装 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git) 部署工具。通过该工具，可以直接将博客发布到 `GitHub Pages`，实现快速部署。

1. 在博客的根目录下执行以下命令来安装 `hexo-deployer-git` 插件

   ```bash
   ~/Desktop/blog
   ❯ npm install hexo-deployer-git --save
   (node:15001) ExperimentalWarning: CommonJS module /usr/local/lib/node_modules/npm/node_modules/debug/src/node.js is loading ES Module /usr/local/lib/node_modules/npm/node_modules/supports-color/index.js using require().
   Support for loading ES Module in require() is an experimental feature and might change at any time
   (Use `node --trace-warnings ...` to show where the warning was created)

   added 9 packages, and audited 232 packages in 5s

   29 packages are looking for funding
   run `npm fund` for details

   found 0 vulnerabilities
   ```

2. 修改 `_config.yml` 文件，添加以下配置

   ```text
   deploy:
      type: git
      repo: https://github.com/<username>/<project>
      # example, https://github.com/onnttf/onnttf.github.io
      branch: gh-pages
   ```

3. 执行 `hexo clean && hexo deploy` 即可

## 日常更新博客

当你写了新的博客文章，或是修改了博客的主题后，只需要通过终端进入本地博客的根目录，执行以下命令来更新并部署博客：

```bash
hexo clean && hexo deploy
```

执行完命令后，所有在本地的修改都会部署到 `GitHub Pages`，你的博客将会自动更新。

## 最后

让我们持续更新博客内容，分享我们的所思所想！
