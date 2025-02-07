# Ubuntu 安装 MySQL 指南

## 安装步骤

### 安装 MySQL APT 配置包

1. 访问 [MySQL APT Repository](https://dev.mysql.com/downloads/repo/apt/)，找到最新的配置包
2. 点击 `Download` 按钮并复制 `No thanks, just start my download` 的下载链接
3. 使用以下命令下载并安装配置包：

   ```bash
   # 下载配置包
   wget https://dev.mysql.com/get/mysql-apt-config_0.8.12-1_all.deb
   # 安装配置包
   sudo dpkg -i mysql-apt-config_0.8.12-1_all.deb
   ```

4. 在配置界面中选择 `MySQL 5.7` 版本，按 `OK` 确认

   ![image](https://file.onnttf.site/2019/04/03/1.jpg)

### 安装 MySQL

```bash
# 更新软件包列表
sudo apt-get update
# 安装 MySQL
sudo apt-get install mysql-server mysql-common mysql-client
```

> 注意：安装过程中系统会弹出 `root` 密码设置界面，请设置一个安全的密码并牢记。如果没有出现密码设置界面，不用担心，您可以在完成安装后按照后续步骤中的说明进行密码设置。确保选择的密码具有足够的复杂度，建议包含大小写字母、数字和特殊字符。

### 验证安装

`MySQL` 安装完成后会自动启动。使用以下命令检查状态：

```bash
sudo systemctl status mysql
```

常用服务命令：

```bash
sudo systemctl start mysql   # 启动
sudo systemctl stop mysql    # 停止
sudo systemctl restart mysql # 重启
```

### 安全配置

#### 修改 root 密码

```bash
# 以 root 身份登录 MySQL
sudo mysql

# 修改验证方式和密码
mysql> ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '您的新密码';
mysql> FLUSH PRIVILEGES;
mysql> EXIT;
```

#### 创建新用户

```bash
mysql> CREATE USER '用户名'@'%' IDENTIFIED BY '密码';
```

> `%` 表示允许远程访问，`localhost` 表示仅允许本地访问

### 优化配置

#### 设置 `UTF-8` 字符集

编辑 `/etc/mysql/mysql.conf.d/mysqld.cnf`：

```ini
[client]
default-character-set=utf8mb4

[mysql]
default-character-set=utf8mb4

[mysqld]
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
```

#### 配置远程访问

1. 编辑配置文件

   ```bash
   sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
   # 注释掉 bind-address = 127.0.0.1
   ```

2. 授权远程访问

   ```bash
   mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '密码' WITH GRANT OPTION;
   mysql> FLUSH PRIVILEGES;
   ```

3. 重启 `MySQL`：

   ```bash
   sudo systemctl restart mysql
   ```

## 常见问题排查

1. 无法远程连接

   - 检查防火墙配置
   - 验证 `bind-address` 设置
   - 确认用户权限

2. 字符集问题

   - 使用 `SHOW VARIABLES LIKE 'character%';` 检查配置
   - 确保应用端使用正确的字符集

## 参考资料

1. [MySQL 官方文档](https://dev.mysql.com/doc/)
2. [Ubuntu MySQL 安装指南](https://ubuntu.com/server/docs/databases-mysql)
