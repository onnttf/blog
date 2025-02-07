# GCD 同步异步与串行并行的深入理解

并发编程是提升 `iOS` 应用性能和用户体验的关键技术，而 `Grand Central Dispatch (GCD)` 作为 `Apple` 推出的强大线程管理框架，为我们提供了简洁而高效的多线程开发方案。然而，面对 `GCD` 中同步/异步、串行/并行等多种组合方式，很多开发者往往感到困惑，无法充分发挥其性能优势。

本文将以通俗易懂的方式深入剖析 `GCD` 的核心概念，通过大量实例和详细解析，帮助你全面理解线程执行的关键细节，掌握在实际开发中灵活运用这些技术的最佳实践。

## 核心概念解析

在开始深入学习 `GCD` 之前，让我们先通过生动的类比来理解几个核心概念：

- **线程**

  一条生产线上的工人：

  - 是执行具体工作的最小单位
  - 由工厂（`CPU`）统一调度安排工作
  - 可以独立完成分配的任务
  - 多个工人可以同时工作

- **任务**

  工厂里需要完成的具体工作：

  - 一件明确的工作（如组装一个零件）
  - 可以用不同方式描述（任务清单或口头指令）
  - 包含具体的操作步骤和目标

- **队列**

  工厂的任务分发通道：

  - 任务按照先来先做的顺序排队
  - 统一管理待处理的工作
  - 决定工人如何领取和执行任务

- **串行队列**

  一条的生产线：

  - 一个工人按顺序处理
  - 必须一个任务做完再做下一个
  - 适合有先后顺序要求的工作

- **并行队列**

  多条并行的生产线：

  - 多个工人可以同时工作
  - 多个任务可以同步进行
  - 适合可以独立完成的工作

- **同步执行**

  等待工人当场完成任务：

  - 工人不能同时做其他事
  - 必须等这件事做完才能继续
  - 任务按顺序逐个完成

- **异步执行**

  分配任务后不用等待：

  - 可以调用多个工人同时工作
  - 任务可以并行处理
  - 分配完就可以做其他事

## GCD 实战指南

让我们通过详细的代码示例和执行结果分析，全面掌握 `GCD` 中各种执行组合方式。每个组合都配有完整的示例代码、执行特点说明和实际运行效果。

### 同步执行 + 串行队列：严格按序执行

特点：

- 在当前线程同步执行
- 任务按严格顺序依次执行
- 需等待当前任务完成才能继续

```objc
dispatch_queue_t queue = dispatch_queue_create("blog.onnttf.site", DISPATCH_QUEUE_SERIAL);
NSLog(@"---start---%@", [NSThread currentThread]);

dispatch_sync(queue, ^{
    sleep(5);
    NSLog(@"任务 1---%@", [NSThread currentThread]);
});

dispatch_sync(queue, ^{
    sleep(3);
    NSLog(@"任务 2---%@", [NSThread currentThread]);
});

dispatch_sync(queue, ^{
    sleep(1);
    NSLog(@"任务 3---%@", [NSThread currentThread]);
});

NSLog(@"---end---%@", [NSThread currentThread]);

/**
 控制台输出：
 ---start---<NSThread: 0x6000000741c0>{number = 1, name = main}
 任务 1---<NSThread: 0x6000000741c0>{number = 1, name = main}
 任务 2---<NSThread: 0x6000000741c0>{number = 1, name = main}
 任务 3---<NSThread: 0x6000000741c0>{number = 1, name = main}
 ---end---<NSThread: 0x6000000741c0>{number = 1, name = main}
*/
```

### 同步执行 + 并行队列：顺序执行但可多线程

特点：

- 虽为并行队列但同步执行导致顺序执行
- 仍在当前线程中执行
- 任务完成后才执行下一个

```objc
dispatch_queue_t queue = dispatch_queue_create("concurrent.queue", DISPATCH_QUEUE_CONCURRENT);

NSLog(@"---start---%@", [NSThread currentThread]);

dispatch_sync(queue, ^{
    sleep(3);
    NSLog(@"任务1---%@", [NSThread currentThread]);
});

dispatch_sync(queue, ^{
    sleep(2);
    NSLog(@"任务2---%@", [NSThread currentThread]);
});

NSLog(@"---end---%@", [NSThread currentThread]);

/* 输出结果：
 ---start---<NSThread: main>
 任务1---<NSThread: main>   // 3秒后
 任务2---<NSThread: main>   // 2秒后
 ---end---<NSThread: main>
*/
```

### 异步执行 + 串行队列：开启新线程顺序执行

特点：

- 会开启新的线程
- 任务在新线程中按顺序执行
- 不会阻塞当前线程

```objc
dispatch_queue_t queue = dispatch_queue_create("serial.queue", DISPATCH_QUEUE_SERIAL);

NSLog(@"---start---%@", [NSThread currentThread]);

dispatch_async(queue, ^{
    sleep(3);
    NSLog(@"任务1---%@", [NSThread currentThread]);
});

dispatch_async(queue, ^{
    sleep(2);
    NSLog(@"任务2---%@", [NSThread currentThread]);
});

NSLog(@"---end---%@", [NSThread currentThread]);

/* 输出结果：
 ---start---<NSThread: main>
 ---end---<NSThread: main>
 任务1---<NSThread: {number = 2}>   // 3秒后
 任务2---<NSThread: {number = 2}>   // 2秒后
*/
```

### 异步执行 + 并行队列：多线程并发执行

特点：

- 开启多个线程并发执行
- 任务执行顺序不确定
- 效率最高的执行方式

```objc
dispatch_queue_t queue = dispatch_queue_create("concurrent.queue", DISPATCH_QUEUE_CONCURRENT);

NSLog(@"---start---%@", [NSThread currentThread]);

dispatch_async(queue, ^{
    sleep(3);
    NSLog(@"任务1---%@", [NSThread currentThread]);
});

dispatch_async(queue, ^{
    sleep(2);
    NSLog(@"任务2---%@", [NSThread currentThread]);
});

NSLog(@"---end---%@", [NSThread currentThread]);

/* 输出结果：
 ---start---<NSThread: main>
 ---end---<NSThread: main>
 任务2---<NSThread: {number = 3}>   // 2秒后
 任务1---<NSThread: {number = 2}>   // 3秒后
*/
```

### 同步执行 + 主队列：死锁风险

特点：

- 在主线程中执行会造成死锁
- 应避免在主线程使用此组合
- 常见的线程安全隐患

```objc
dispatch_queue_t queue = dispatch_get_main_queue();

NSLog(@"---start---%@", [NSThread currentThread]);

// 会导致死锁
dispatch_sync(queue, ^{
    NSLog(@"任务1---%@", [NSThread currentThread]);
});

NSLog(@"---end---%@", [NSThread currentThread]);

/* 输出结果：
 ---start---<NSThread: main>
 // 程序死锁
*/
```

### 异步执行 + 主队列：主线程安全执行

特点：

- 确保任务在主线程执行
- 适合 `UI` 操作相关任务
- 不会造成死锁问题

```objc
dispatch_queue_t queue = dispatch_get_main_queue();

NSLog(@"---start---%@", [NSThread currentThread]);

dispatch_async(queue, ^{
    sleep(3);
    NSLog(@"任务1---%@", [NSThread currentThread]);
});

dispatch_async(queue, ^{
    sleep(2);
    NSLog(@"任务2---%@", [NSThread currentThread]);
});

NSLog(@"---end---%@", [NSThread currentThread]);

/* 输出结果：
 ---start---<NSThread: main>
 ---end---<NSThread: main>
 任务1---<NSThread: main>   // 3秒后
 任务2---<NSThread: main>   // 2秒后
*/
```

## 最后

通过本文的详细讲解，我们系统地学习了 `GCD` 中的核心概念和各种执行组合方式。以下是关键要点总结：

- 同步/异步决定是否阻塞当前线程

  - 同步执行会等待任务完成
  - 异步执行立即返回继续执行

- 串行/并行决定任务执行方式

  - 串行队列按顺序执行任务
  - 并行队列可同时执行多个任务

- 常见使用场景

  - `UI` 操作优先使用主队列
  - 耗时操作使用异步并行队列
  - 有序操作使用串行队列
  - 避免主线程同步执行造成死锁

在实际开发中，应根据具体需求选择最合适的组合方式。合理运用这些特性，既可以保证代码的正确性，又能充分发挥系统性能，从而开发出高效稳定的应用程序。
