# 如何清理 Git 仓库

## Git 仓库体积增长的原因

Git 通过版本控制系统记录文件的每一个变更。即使只修改了文件中的一行内容，Git 也会生成一个新的 `blob` 对象来存储更新后的文件内容。每次提交都会生成新对象，导致仓库体积不断增加。随着项目开发的深入，这些对象会越来越多。

虽然 Git 会在 `git gc` 打包或 `git push` 时自动进行打包压缩，将 `blob` 对象合并成包文件并使用增量编码只保存差异内容，但仓库体积仍会随着使用逐渐增长。因此需要定期清理来保持仓库轻量。

## 清理方法

### 清理大文件

这种方法主要用于清理占用空间较大或不再需要的文件（以下称为冗余文件）及其提交记录。**注意：以下操作会真实删除文件，请谨慎操作！**

1. 定位冗余文件

   使用 [git-rev-list](https://git-scm.com/docs/git-rev-list) 和 [git-verify-pack](https://git-scm.com/docs/git-verify-pack) 命令查找最占空间的文件：

   ```bash
   git rev-list --objects --all | \
   grep "$(git verify-pack -v .git/objects/pack/*.idx | \
   sort -k 3 -n | tail -5 | awk '{print $1}')"
   ```

2. 删除冗余文件

   使用 [git-filter-branch](https://git-scm.com/docs/git-filter-branch) 删除冗余文件：

   ```bash
   git filter-branch --force --index-filter \
   'git rm -r --cached --ignore-unmatch 文件名' \
   --prune-empty -- --all
   ```

   **执行删除前务必仔细检查文件列表！**

3. 彻底清理

   执行以下命令彻底清理仓库，删除备份引用、过期的 reflog 记录，并对仓库进行垃圾回收：

   ```bash
   # 删除备份的引用
   git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
   # 清理过期的 reflog 记录
   git reflog expire --expire=now --all
   # 进行垃圾回收，清理不可达对象
   git gc --prune=now
   ```

4. 确认无误后，推送更新到远程仓库

   ```bash
   git push --force
   ```

### 重置仓库

这是一个快速但激进的解决方案，会**完全清除仓库的所有历史记录**。由于操作不可逆，建议仅在以下情况使用：

- 仓库体积过大且历史记录不再重要
- 需要彻底清除敏感信息
- 重新开始一个干净的版本历史

操作步骤如下：

1. 清理所有远程分支

   ```bash
   # 删除除了 master 之外的所有远程分支
   git branch -r | grep origin | grep -v '>' | grep -v master | xargs -L1 | awk '{sub(/origin\//,"");print}'| xargs git push origin --delete
   ```

2. 重新初始化仓库

   ```bash
   # 删除旧的 .git 目录并初始化新仓库
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit: Reset repository"
   ```

3. 重新关联远程仓库

   ```bash
   # 添加远程仓库地址并强制推送
   git remote add origin <仓库地址>
   git push -f origin master
   ```

**注意：** 此操作会永久删除所有提交历史、分支信息和标签。
