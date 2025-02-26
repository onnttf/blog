# iOS 消息转发机制

在 `iOS` 开发中，当对象收到无法理解的消息时（即出现 `unrecognized selector sent to instance 0x87` 错误），系统会自动启动消息转发机制。这套精心设计的机制为开发者提供了多个处理机会，让我们能够优雅且灵活地处理这类异常情况。本文将深入剖析这个转发流程的完整实现机制及其实践应用。

## 消息转发的完整流程

消息转发是 `Runtime` 中优雅处理方法未找到异常的重要机制，主要分为以下两个阶段：

1. 动态方法解析（`Dynamic Method Resolution`）

   当对象收到未知消息时，系统首先会询问该对象是否能够动态添加方法实现来处理。这为我们提供了运行时动态扩展类功能的机会。

2. 消息转发（`Message Forwarding`）

   如果动态方法解析未能解决问题，则会进入正式的转发处理：

   - 快速转发路径（`Fast Forwarding Path`）

     - 通过 `forwardingTargetForSelector:` 寻找能处理该消息的备用接收者
     - 这是最高效的转发方式，直接将消息转交给其他对象

   - 完整转发机制（`Normal Forwarding Mechanism`）

     - 在没有合适的备用接收者时启动
     - 将消息完整封装为 `NSInvocation` 对象，支持更灵活的处理方式
     - 虽然开销较大，但提供了最大的处理自由度

## 动态方法解析

在消息转发的第一个阶段，系统会通过动态方法解析机制尝试动态添加方法实现。根据待处理的方法类型，系统会调用以下两个方法之一：

处理类方法时调用：

```objc
+ (BOOL)resolveClassMethod:(SEL)sel;
```

处理实例方法时调用：

```objc
+ (BOOL)resolveInstanceMethod:(SEL)sel;
```

这个阶段我们可以利用 `Runtime API` 动态添加方法实现。下面是一个实际的示例：

```objc
/**
 * 动态解析未实现的实例方法。
 * 当调用一个未实现的实例方法时，系统会调用此方法，允许动态添加方法实现。
 *
 * @param sel 待处理的方法选择器
 * @return 如果成功动态添加了方法，返回 YES；否则返回 NO。
 */
+ (BOOL)resolveInstanceMethod:(SEL)sel {
    // 检查是否是目标未实现的方法（这里以 `someMethod:` 为例）
    if (sel == @selector(someMethod:)) {
        // 动态添加方法的实现
        class_addMethod(self,
                        sel,
                        (IMP)dynamicMethodIMP, // 方法实现指针
                        "v@:");               // 方法签名（void 返回值，接受 id 和 SEL 参数）
        return YES; // 标记成功处理
    }

    // 如果无法处理该方法，则返回 NO，转交给下一步方法转发机制
    return NO;
}

/**
 * 动态添加的方法实现。
 *
 * @param self 当前对象
 * @param _cmd 当前调用的方法选择器
 */
void dynamicMethodIMP(id self, SEL _cmd) {
    // 方法的具体逻辑
    NSLog(@"动态添加的方法被调用！");
}
```

## 消息转发处理

### 快速消息转发

当动态方法解析失败后，系统会尝试快速转发路径。通过实现 `forwardingTargetForSelector:` 方法，我们可以将消息优雅地转发给其他对象处理：

```objc
/**
 * 快速消息转发
 * 当对象接收到一个无法响应的消息时，系统会调用此方法，允许返回另一个可以处理该消息的对象。
 *
 * @param aSelector 待转发的方法选择器
 * @return 能处理该消息的对象；返回 nil 时，消息会进入完整的消息转发流程。
 */
- (id)forwardingTargetForSelector:(SEL)aSelector {
    // 检查是否是需要转发的目标方法
    if (aSelector == @selector(targetMethod:)) {
        // 返回能处理该方法的对象
        return [[HandlerClass alloc] init];
    }

    // 未匹配到目标方法，返回 nil，进入完整的消息转发流程
    return nil;
}
```

### 完整消息转发

当快速转发返回 `nil` 时，系统会启动完整的转发机制。这个阶段会将消息完整地封装到 `NSInvocation` 对象中，提供更灵活的处理方式：

```objc
/**
 * 完整消息转发
 * 当对象无法快速转发消息时，系统会调用此方法，允许手动指定消息的处理对象或抛出异常。
 *
 * @param invocation 包含待转发消息的调用对象，封装了方法调用的所有信息。
 */
- (void)forwardInvocation:(NSInvocation *)invocation {
    // 获取当前方法选择器
    SEL selector = invocation.selector;

    // 创建潜在的消息接收者
    id target = [HandlerClass new];

    // 检查目标对象是否能够处理该消息
    if ([target respondsToSelector:selector]) {
        // 将消息转发给目标对象处理
        [invocation invokeWithTarget:target];
    } else {
        // 如果没有对象能处理该消息，调用父类的默认实现
        [super forwardInvocation:invocation];

        // 或者抛出未识别选择器的异常
        // [self doesNotRecognizeSelector:selector];
    }
}

/**
 * 提供方法签名以支持完整消息转发。
 * 系统在调用 `forwardInvocation:` 之前会调用此方法以获取消息的签名。
 *
 * @param aSelector 待获取签名的方法选择器
 * @return 方法的签名。如果返回 nil，则不会调用 `forwardInvocation:`。
 */
- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector {
    // 尝试获取当前类的签名
    NSMethodSignature *signature = [super methodSignatureForSelector:aSelector];
    if (!signature) {
        // 如果当前类没有提供签名，从目标处理类尝试获取签名
        signature = [HandlerClass instanceMethodSignatureForSelector:aSelector];
    }
    return signature;
}
```

## 最后

通过这套完整的消息转发机制，我们不仅可以优雅地处理"方法未找到"的异常情况，还可以：

- 实现更灵活的消息派发机制
- 在运行时动态扩展类的功能
- 优化代码架构，提高代码复用性
- 增强应用的容错能力和健壮性

这些特性使消息转发成为 `iOS` 开发中一个强大而实用的机制。在实际开发中，建议根据具体场景选择合适的转发方式，既保证代码质量，又确保运行效率。
