# Charles 证书安装指南

`Charles` 是一款功能强大的网络调试工具，它集 `HTTP` 代理服务器、`HTTP` 监视器和反向代理服务器于一体。作为开发者，您可以通过 `Charles` 监控所有的 `HTTP`、`HTTPS` 通信，包括请求、响应以及完整的头信息（`cookies`、缓存等）。

## Charles 核心功能

1. **网络请求监控**：实时抓取 `HTTP/HTTPS` 请求和响应
2. **调试辅助**：支持请求重发，方便后端接口调试
3. **参数修改**：可拦截并修改请求参数，灵活控制请求内容
4. **网络模拟**：支持模拟各种网络环境（`2G`/`3G`/`4G`），测试应用表现
5. **本地/远程映射**：可将线上资源映射到本地，便于开发调试
6. **移动端支持**：完整支持移动设备的抓包需求
7. **请求编辑**：支持动态修改和拦截网络请求

## 证书安装指南

要使用 Charles 的全部功能，我们需要先完成证书安装：

![image](https://file.onnttf.site/2019/01/02/1.jpg)

### PC 端证书安装

1. **安装证书**

   进入 `Charles` 菜单：`Help -> SSL Proxying -> Install Charles Root Certificate`

   系统会提示选择证书存储位置，请根据实际需求选择合适的钥匙串：

   ![image](https://file.onnttf.site/2019/01/02/2.jpg)

2. **信任证书**

   - 打开系统的"钥匙串访问"
   - 在搜索框中输入 `Charles` 定位证书
   - 双击 `Charles Proxy CA` 证书
   - 展开"信任"选项，将证书信任级别设置为"始终信任"

   ![image](https://file.onnttf.site/2019/01/02/3.jpg)

### iOS 模拟器证书安装

1. **安装证书**

   `Charles` 菜单操作：`Help -> SSL Proxying -> Install Charles Root Certificate in iOS Simulators`

2. **信任证书**

   在模拟器中依次打开：`Settings -> General -> About -> Certificate Trust Settings`

   找到 `Charles` 证书并启用信任开关：

   ![image](https://file.onnttf.site/2019/01/02/4.jpg)

### 移动设备证书安装

1. **安装证书**

   在 `Charles` 中打开证书安装向导：`Help -> SSL Proxying -> Install Charles Root Certificate on a Mobile Device or Remote Browser`

   ![image](https://file.onnttf.site/2019/01/02/5.jpg)

   安装步骤：

   - 确保移动设备与运行 `Charles` 的电脑处于同一网络
   - 在移动设备的 `WiFi` 设置中配置代理服务器
   - 输入 `Charles` 显示的代理地址：`xxx.xx.xxx.xxx:xxxx`
   - 使用移动设备浏览器访问 [chls.pro/ssl](https://github.com/onnttf/blog/tree/322c1a6adda8dd6be880c9622823871046e6654b/mac/chls.pro/ssl/README.md) 下载安装证书

2. **信任证书**

   在移动设备中依次打开：设置 -> 通用 -> 关于本机 -> 证书信任设置

   找到并启用 `Charles` 证书的信任选项：

   ![image](https://file.onnttf.site/2019/01/02/7.jpg)
