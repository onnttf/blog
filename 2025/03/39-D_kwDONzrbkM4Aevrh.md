# 高效的文件匹配工具：Glob 模式

在日常工作中，文件匹配是一项常见的任务，例如：

1. 在构建系统中筛选特定类型的源代码文件（如 `*.go` 或 `*.py`）
2. 在日志管理中查找特定时间范围的日志文件（如 `access_log_2024-03-*.log`）

虽然可以通过正则表达式或脚本来完成这些任务，但它们的语法较为复杂且维护成本较高。相比之下，Glob 模式以其简洁直观的语法，在文件筛选与查找中提供了一种更高效、易用的解决方案，广泛应用于各类场景中。

## 什么是 Glob 模式

Glob 模式是一种轻量级的文件路径匹配语法，常用于 `Unix-like` 系统以及多种编程语言中。它通过特定的通配符来匹配文件和目录路径，使用户能够快速查找符合条件的文件。

### 常见的 Glob 语法规则

| 通配符    | 功能描述                                       | 示例             | 匹配案例                              | 不匹配案例                                      |
| --------- | ---------------------------------------------- | ---------------- | ------------------------------------- | ----------------------------------------------- |
| `*`       | 匹配零个或多个任意字符（不跨越路径分隔符 `/`） | `src/*.js`       | `src/index.js`、`src/app.js`          | `src/utils/date.js`、`src/components/button.js` |
| `?`       | 匹配单个任意字符                               | `image-??.png`   | `image-01.png`、`image-ab.png`        | `image-1.png`、`image-123.png`                  |
| `[...]`   | 匹配括号内任一单个字符                         | `file[123].txt`  | `file1.txt`、`file2.txt`、`file3.txt` | `file4.txt`、`file12.txt`                       |
| `[a-z]`   | 匹配指定字符范围内的任一字符                   | `log_[0-9].txt`  | `log_2.txt`、`log_7.txt`              | `log_a.txt`、`log_10.txt`                       |
| `[!...]`  | 匹配不在括号内的任一字符                       | `file[!abc].txt` | `filed.txt`、`file1.txt`              | `filea.txt`、`fileb.txt`                        |
| `**`      | 递归匹配任意目录层级（需环境支持）             | `docs/**/*.md`   | `docs/readme.md`、`docs/api/auth.md`  | 在不支持递归匹配的环境中无法匹配子目录          |
| `{a,b,c}` | 扩展匹配：匹配大括号内任一逗号分隔选项         | `*.{js,ts}`      | `app.js`、`config.ts`                 | `app.py`、`index.html`                          |
| `\`       | 转义字符，用于匹配特殊字符本身                 | `\*.txt`         | 实际文件名为 `*.txt`                  | `a.txt`、`b.txt`                                |

**提示：** 与正则表达式相比，Glob 模式的语法更简单，特别适用于日常文件匹配任务。

## Glob 模式的实际应用

Glob 模式作为一种强大的文件匹配工具，在开发工作流程中扮演着不可或缺的角色。它能够帮助我们高效地筛选文件，大幅提升工作效率。以下是几个常见的实际应用场景：

### 命令行操作

在命令行中，Glob 模式可以简化文件查找、复制和删除等操作。例如：

```bash
# 删除 /tmp 目录下所有扩展名为 .tmp 的临时文件
rm -f /tmp/*.tmp

# 查找 src 目录中所有 JavaScript 文件
find src -name "*.js"

# 在所有配置文件中搜索包含 "api_key" 的行（支持 JSON、YAML 格式）
grep "api_key" config/*.{json,yaml,yml}

# 将 docs 目录下所有 Markdown 和文本文件复制到 /backup/docs 目录
cp docs/*.{md,txt} /backup/docs/
```

### 版本控制系统中的应用

在 Git 等版本控制系统中，Glob 模式常用于 .gitignore 文件中，帮助指定应忽略的文件或目录，从而保持代码仓库的整洁。例如：

```plaintext
# 忽略所有 .log 文件
*.log

# 忽略 node_modules 目录
node_modules/

# 忽略 build 目录中的所有文件，但保留目录本身
build/*
!build/.gitkeep

# 忽略所有以 .env 开头的文件，但保留 .env.example
.env*
!.env.example
```

### 构建工具配置

在 Webpack、Rollup 或 Gulp 等构建工具中，Glob 模式用于动态匹配源文件、资源文件等，从而实现编译、打包或测试任务。例如，在 Webpack 配置中：

```js
// Webpack 配置示例
const glob = require('glob');

module.exports = {
   entry: './src/index.js',
   module: {
      rules: [
         {
            test: /\.css$/,
            include: glob.sync('./src/**/*.css'),
            use: ['style-loader', 'css-loader']
         }
      ]
   }
};
```

## 最后

Glob 模式以其简洁直观的语法，为文件匹配任务提供了高效而灵活的解决方案。虽然它不具备正则表达式的所有功能，但 Glob 模式已足够满足大多数需求。通过掌握常用的通配符及其应用场景，你可以大幅提升文件筛选的效率。

如果你有任何问题或更好的使用经验，欢迎在下方留言分享！
