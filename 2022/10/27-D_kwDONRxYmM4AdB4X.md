# 一文了解 JWT

![image](https://file.onnttf.site/2022/10/09/1.jpg)

`JWT`（JSON Web Token）是一种在网络各方之间安全传输信息的令牌。它采用 `JSON` 对象格式存储信息，具有简洁、安全和易于使用的特点。

作为一个[开放标准](https://www.rfc-editor.org/rfc/rfc7519)，`JWT` 提供了一种紧凑且可靠的方式来传递信息。其工作原理是：首先将信息编码为 `JSON` 对象，然后将该对象嵌入到 `JSON Web Signature`（`JWS`）结构中作为有效载荷，或者作为 `JSON Web Encryption`（`JWE`）结构的明文。通过这种方式，信息可以被数字签名或使用消息验证码（`MAC`）进行完整性和真实性验证，从而确保数据传输的安全性。

## JWT 的构成

`JWT` 由三个关键部分组成：

- 头部（`header`）：包含令牌类型和签名算法等元数据
- 有效载荷（`payload`）：存储需要传递的实际数据内容
- 签名（`signature`）：用于验证令牌的有效性和完整性

生成 `JWT` 的过程如下：

1. 分别对这三个部分进行 `Base64URL` 编码
2. 使用 `.` 符号将编码后的字符串按顺序连接
3. 最终形成一个完整的 `JWT` 字符串

下面是一个典型的 `JWT` 示例：

```text
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqd3QiLCJzdWIiOiIxIiwiYXVkIjoiYXBwMSIsImlhdCI6MTY2NTMwNzgwMCwibmJmIjoxNjY1Mzk0MjAwLCJleHAiOjE2NjU5MTI2MDAsImp0aSI6MSwibmFtZSI6InpoYW5ncGVuZyJ9.8QhYZSONATlpO-oZtUoQOlyzjGSpeNvizPofT5ep0WQ
```

接下来，让我们深入了解 JWT 的三个核心组成部分。每个部分都有其独特的作用和特点：

### 头部（header）

`header` 是一个描述 `JWT` 元数据的 `JSON` 对象。这个简洁但重要的部分通常包含两个关键字段：

| 字段 | 描述                                               |
| :--- | :------------------------------------------------- |
| typ  | `type`，表示令牌的类型，统一写为 `JWT`             |
| alg  | `algorithm`，表示签名使用的算法，如：`HMAC SHA256` |

来看一个具体示例：

```json
{
    "typ": "JWT",
    "alg": "HS256"
}
```

经过 `Base64URL` 编码后，我们得到 JWT 的第一部分：

```text
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9
```

### 有效载荷（payload）

作为 JWT 的核心部分，`payload` 承载着我们需要传递的实际数据。它同样是一个 `JSON` 对象，其字段分为标准字段（在 [RFC7519](https://www.rfc-editor.org/rfc/rfc7519#section-4.1) 中定义）和自定义字段两类。

以下是常用的标准字段：

| 字段 | 描述                                                                    |
| :--- | :---------------------------------------------------------------------- |
| iss  | `issuer`，签发人，可以用于确定签发 `JWT` 的人                           |
| sub  | `subject`，签发的主题，可以用于表示被签发的人是谁或者被签发的内容是什么 |
| aud  | `audience`，受众者，可以用于表示该 `JWT` 该被哪些主体使用               |
| iat  | `issued at`，签发时间                                                   |
| nbf  | `not before`，启用时间，在该时间前，此 `JWT` 是无效的                   |
| exp  | `expiration time`，过期时间，在该时间后，此 `JWT` 是无效的              |
| jti  | `JWT ID`，唯一标识                                                      |

一个包含标准字段和自定义字段的实例：

```json
{
    "iss": "jwt",
    "sub": "1",
    "aud": "app1",
    "iat": 1665307800,
    "nbf": 1665394200,
    "exp": 1665912600,
    "jti": 1,
    "name": "zhangpeng"
}
```

将该 payload 进行 `Base64URL` 编码，得到：

```text
eyJpc3MiOiJqd3QiLCJzdWIiOiIxIiwiYXVkIjoiYXBwMSIsImlhdCI6MTY2NTMwNzgwMCwibmJmIjoxNjY1Mzk0MjAwLCJleHAiOjE2NjU5MTI2MDAsImp0aSI6MSwibmFtZSI6InpoYW5ncGVuZyJ9
```

**注意**：由于 JWT 的 payload 仅做 `Base64URL` 编码而非加密，任何人都可以解码查看其中的内容。因此切勿在其中存储敏感信息（如密码）。

### 签名（signature）

`signature` 是确保 JWT 完整性和真实性的关键。它的生成过程如下：

1. 获取编码后的 header 和 payload
2. 使用 "." 将它们连接
3. 使用 header 中指定的算法（如 `HMACSHA256`）和密钥进行签名

签名的计算公式：

```text
HMACSHA256(
  Base64URLEncode(header) + "." + Base64URLEncode(payload),
  secret
)
```

使用我们之前的 header 和 payload，计算得到的签名为：

```text
8QhYZSONATlpO-oZtUoQOlyzjGSpeNvizPofT5ep0WQ-hoICKvR06A
```

**注意**：为了确保安全性，JWT 的签发必须在服务器端进行，这样可以有效保护签名密钥（`secret`）。一旦密钥泄露，任何人都可以伪造有效的 JWT。

最后，将这三个部分用 "." 连接，得到完整的 JWT：

```text
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJqd3QiLCJzdWIiOiIxIiwiYXVkIjoiYXBwMSIsImlhdCI6MTY2NTMwNzgwMCwibmJmIjoxNjY1Mzk0MjAwLCJleHAiOjE2NjU5MTI2MDAsImp0aSI6MSwibmFtZSI6InpoYW5ncGVuZyJ9.8QhYZSONATlpO-oZtUoQOlyzjGSpeNvizPofT5ep0WQ
```

## JWT 的优缺点

### 优点

- **跨语言兼容性**：由于基于 `JSON` 格式，JWT 可以在任何编程语言中轻松使用和处理
- **信息丰富**：`payload` 部分可灵活存储业务所需的各类信息，使其成为功能强大的信息载体
- **轻量便携**：结构简单紧凑，易于在网络中传输，适合移动端等场景
- **自包含性**：包含了验证和授权所需的所有信息，减少了数据库查询的需求
- **无状态**：服务器无需存储会话信息，有助于应用扩展

### 缺点

- **吊销困难**：由于服务端不保存 token 状态，要让已签发的 JWT 立即失效需要额外的实现机制
- **安全性考量**：
  - `payload` 部分仅做 `Base64` 编码，敏感数据需要额外加密
  - `token` 一旦泄露，在过期前都可能被他人使用
- **大小限制**：由于需要在请求中传输，过大的 payload 可能影响传输效率
- **续期机制**：token 过期后需要重新认证，实现自动续期相对复杂

## JWT 常见的使用场景

### 身份认证与授权

JWT 最常见且重要的应用场景是用于身份认证和授权系统。具体表现在：

- **登录认证**：用户登录成功后，服务器生成包含用户身份信息的 JWT，后续请求只需携带该令牌即可验证身份
- **访问控制**：通过在 JWT 中包含权限信息，可以精确控制用户对特定路由、服务和资源的访问权限
- **单点登录（SSO）**：JWT 轻量级的特性使其成为跨域单点登录的理想选择，用户只需登录一次即可访问多个系统

### 安全的信息传输

JWT 提供了一种安全可靠的信息传输机制：

- **数据完整性**：通过签名机制确保数据在传输过程中未被篡改
- **身份验证**：使用非对称加密（公钥/私钥）可以验证发送方身份
- **信息加密**：支持对敏感信息进行加密保护
- **时效控制**：可以为传输的信息设置有效期，超时自动失效

这些特性使 JWT 成为在分布式系统中传递重要信息的理想方案。

## 总结

通过以上的探讨，我们深入了解了 `JWT` 这一设计精巧而优雅的技术方案。让我们回顾其关键特点：

- **本质简单**：`JWT` 本质上是一个承载 `JSON` 格式信息的字符串，易于理解和使用
- **结构紧凑**：通过 `Base64URL` 编码压缩数据体积，在保证功能的同时实现高效传输
- **安全可靠**：采用数字签名和加密算法确保信息完整性，有效防止数据被篡改
- **使用灵活**：既可用于身份认证，也可作为安全的信息传输载体，应用场景丰富
- **跨平台兼容**：基于开放标准，支持多种编程语言和平台，便于系统集成

这些优秀的特性使 `JWT` 成为现代 Web 应用中不可或缺的重要工具，为分布式系统的身份认证和信息传输提供了可靠的解决方案。虽然存在一些局限性，但只要在合适的场景下合理使用，`JWT` 仍然是一个强大而实用的技术选择。