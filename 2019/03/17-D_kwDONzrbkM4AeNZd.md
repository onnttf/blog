# +load 和 +initialize 的特点与区别

`+load` 和 `+initialize` 是 `Objective-C` 中两个重要的初始化方法，它们有着不同的使用场景和特点。

|          | `+load`                            | `+initialize`                                |
| -------- | ---------------------------------- | -------------------------------------------- |
| 调用时机 | 类、分类被加载到运行时时立即调用   | 类第一次接收到消息时懒加载调用               |
| 调用方式 | 直接通过函数地址调用，更快速       | 通过 `objc_msgSend` 消息发送机制调用，更灵活 |
| 调用顺序 | 编译顺序决定，严格遵循继承链       | 继承链顺序调用，每个类仅调用一次             |
| 使用场景 | 运行时方法替换、关联对象等底层操作 | 类的一般性初始化工作                         |

## +load

`+load` 方法主要用于类的早期设置，具有以下特点：

1. 在 `main()` 函数执行前就会调用，按照编译先后顺序调用，加载时机最早
2. 继承链上的调用顺序为：父类 -> 子类 -> 分类
3. 通过函数指针直接调用，性能较好
4. 适合进行 `Method Swizzling` 等运行时操作
5. 每个类的 `+load` 方法仅会调用一次

## +initialize

`+initialize` 方法用于类的延迟初始化，特点如下：

1. 采用消息发送机制调用，支持继承和动态特性
2. 调用顺序遵循继承链：父类 -> 子类
3. 懒加载特性 - 仅在首次使用类时调用，提高性能
4. 线程安全，运行时保证每个类只初始化一次
5. 子类若未实现会继承父类实现
6. 适合处理类的一般初始化工作
