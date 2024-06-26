---
author: Zhang Peng
category: 🙌 Show and tell
labels: 
discussion: https://github.com/onnttf/blog/discussions/6
updatedAt: 2024-04-08T01:04:59+08:00
---

# 面试啊面试~

1. 下面代码打印 `true` 还是 `false`？

   ```objc
    id arr = [[NSArray alloc] init];
    if ([[arr class] isKindOfClass:[NSArray class]]) {
        NSLog(@"true");
    } else {
        NSLog(@"false");
    }
   ```

   **答案：**
   打印 false
   ![image](https://file.onnttf.site/2017/11/09/1.jpeg) **分析：**
   因为 `NSArray` 运用了类蔟 `(Class clusters)` 的设计模式，类簇其实是对现实的一种抽象和封装，基于抽象工厂模式 `(Abstract Factory Pattern)`。`NSNumber`、`NSString`、`NSArray`等均是如此。
   如想更深入的了解相关概念，可以查阅下面两篇文章：1. Sunny 大神写的[《从 NSArray 看类簇》](http://blog.sunnyxx.com/2014/12/18/class-cluster/) 2. [《Objective-C 类族和工厂模式》](http://www.cocoachina.com/cms/wap.php?action=article&id=10296) 代码在请见[Demo](https://github.com/onnttf/P_App_OC.git)中的 `Demo2`

2. 下面代码打印什么内容？

   ```objc
   NSMutableSet *mSet = [[NSMutableSet alloc] init];

   [mSet addObject:@[@1, @2]];
   NSLog(@"1---%@", mSet);

   NSMutableArray *mArr = [[NSMutableArray alloc] initWithObjects:@1, nil];

   [mSet addObject:mArr];
   NSLog(@"2---%@", mSet);

   [mArr addObject:@2];
   NSLog(@"3---%@", mSet);

   [mSet addObject:@[@1, @2]];
   NSLog(@"4---%@", mSet);
   ```

   **答案：**
   ![image](https://file.onnttf.site/2017/11/09/2.jpeg) **分析：**

   * 集合（NSMutableSet）和数组（NSMutableArray）有相似之处，都是存储不同的对象的地址；不过 NSMutableArray 是有序的集合，NSMutableSet 是无序的集合。
   * 集合是一种哈希表，运用散列算法，查找集合中的元素比数组速度更快，但是它没有顺序。当插入相同的数据时，不会有任何效果。

    第一次输出时，创建了一个包含 `@[@1, @2]` 的 `NSMutableSet`

    第二次输出时，向已经创建的 `mSet` 中添加一个可变数组

    第三次输出时，向前面创建的 `mArr` 中添加一个 `@2`，可以成功的将 `@[@1, @2]` 这个 `mArr` 添加到 `mSet` 中，应该是因为 `@[@1, @2]` 是 `__NSArrayI`，`mArr` 是 `__NSArrayM` ,不能成功的判断相等

    第四次输出时，由于集合内已经存在相同的 `@[@1, @2]`，而 `mSet` 中的元素是不能重复的，所以没有成功添加

    代码在请见[Demo](https://github.com/onnttf/P_App_OC.git)中的 Demo3
