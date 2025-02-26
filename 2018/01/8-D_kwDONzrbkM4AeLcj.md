# 如何监听 UIScrollView 停止滚动

在开发过程中，监听 `UIScrollView` 的停止滚动是一个常见需求。我们可能需要在停止滚动时执行以下操作：

- 图片的按需加载与预加载
- 列表数据的异步预加载
- 滚动结束动画效果
- 性能优化与资源释放
- 数据统计与埋点

虽然苹果没有直接提供相应的回调方法，但本文将介绍如何通过 `Runtime` 实现一个简单易用且低侵入性的监听方案。

## Runtime

[Runtime](https://developer.apple.com/documentation/objectivec/objective_c_runtime) 提供了在运行时动态修改类、方法和消息传递的能力。通过 `Runtime`，我们可以：

- 在运行时动态修改方法实现
- 为已有类添加新的方法和属性
- 实现更灵活的消息转发机制

本文将结合实际场景，详细介绍如何运用 `Runtime` 的 `Method Swizzling` 实现一个监听 `UIScrollView` 停止滚动的方案。

相比传统方案，具有以下优势：

- 使用简单，接入成本低
- 代码侵入性小，易于维护
- 运行时性能开销小
- 具备良好的扩展性

## UIScrollView 停止滚动的场景分析

基于大量用户交互数据分析，停止滚动主要可以归纳为以下三种情况：

1. 快速滑动后的惯性停止

   - 用户快速滑动后松开手指
   - `ScrollView` 根据滑动速度进行减速
   - 在物理引擎作用下自然停止
   - 常见于快速浏览长列表场景

2. 交互式强制停止

   - 用户在惯性滚动过程中
   - 通过按压屏幕进行制动
   - 立即终止当前滚动状态
   - 多用于紧急停止或位置调整

3. 精确式缓慢停止

   - 用户通过缓慢拖动内容
   - 精确控制内容偏移量
   - 在目标位置直接松手
   - 适用于精确定位需求

## 核心代理方法与实现思路

为了准确捕获这些停止事件，我们需要合理运用以下代理方法：

```objc
// 即将开始减速滚动
- (void)scrollViewWillBeginDecelerating:(UIScrollView *)scrollView;

// 滚动减速结束
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView;

// 拖拽结束，decelerate 表示是否将要进入减速过程
- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate;
```

通过这些代理方法的组合调用，我们可以实现对每种停止事件的精确识别。

## Runtime 方案实现详解

通过 `Runtime` 实现 `UIScrollView` 停止滚动的监听，本节将详细介绍这套方案的具体实现细节。

`UIScrollView` 为我们提供了三个状态，通过它们我们可以精确判断滚动视图的当前状态：

```objc
@property(nonatomic,readonly,getter=isTracking) BOOL tracking;     // 手指是否触摸屏幕
@property(nonatomic,readonly,getter=isDragging) BOOL dragging;     // 是否正在拖拽滑动
@property(nonatomic,readonly,getter=isDecelerating) BOOL decelerating;  // 是否在减速过程中
```

### 监听停止滚动的核心逻辑

通过组合 `tracking`、`dragging` 和 `decelerating` 这三个状态，我们可以准确识别 `UIScrollView` 停止滚动的时机。具体判断逻辑如下：

```objc
- (void)scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
    // 判断减速停止：手指未触摸 + 未拖拽 + 未减速
    BOOL scrollToScrollStop = !scrollView.tracking && !scrollView.dragging && !scrollView.decelerating;
    if (scrollToScrollStop) {
        [self scrollViewDidEndScroll];
    }
}

- (void)scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
    if (!decelerate) {
        // 判断拖拽停止：手指触摸 + 未拖拽 + 未减速
        BOOL dragToDragStop = scrollView.tracking && !scrollView.dragging && !scrollView.decelerating;
        if (dragToDragStop) {
            [self scrollViewDidEndScroll];
        }
    }
}

- (void)scrollViewDidEndScroll {
    NSLog(@"停止滚动触发！！！");
}
```

### 添加停止滚动的回调

1. 封装健壮的 `Hook` 工具方法

   ```objc
   static void Hook_Method(Class originalClass, SEL originalSel,
                         Class replacedClass, SEL replacedSel, SEL noneSel) {
       // 获取原始方法
       Method originalMethod = class_getInstanceMethod(originalClass, originalSel);
       Method replacedMethod = class_getInstanceMethod(replacedClass, replacedSel);

       // 处理原始方法不存在的情况
       if (!originalMethod) {
           Method noneMethod = class_getInstanceMethod(replacedClass, noneSel);
           class_addMethod(originalClass, originalSel,
                         method_getImplementation(noneMethod),
                         method_getTypeEncoding(noneMethod));
           return;
       }

       // 添加替换方法
       BOOL addMethod = class_addMethod(originalClass, replacedSel,
                                      method_getImplementation(replacedMethod),
                                      method_getTypeEncoding(replacedMethod));

       // 交换方法实现
       if (addMethod) {
           Method newMethod = class_getInstanceMethod(originalClass, replacedSel);
           method_exchangeImplementations(originalMethod, newMethod);
       }
   }
   ```

2. 对 `UIScrollView` 的代理方法进行替换

   ```objc
   + (void)load {
       static dispatch_once_t onceToken;
       dispatch_once(&onceToken, ^{
           // 确保方法替换只执行一次
           Method originalMethod = class_getInstanceMethod([UIScrollView class], @selector(setDelegate:));
           Method replaceMethod = class_getInstanceMethod([UIScrollView class], @selector(hook_setDelegate:));
           method_exchangeImplementations(originalMethod, replaceMethod);
       });
   }

   // 替换 setDelegate 方法，注入自定义逻辑
   - (void)hook_setDelegate:(id<UIScrollViewDelegate>)delegate {
       // 调用原始 setDelegate 方法（通过方法交换实现）
       [self hook_setDelegate:delegate];

       // 仅对 UIScrollView 实例进行方法注入
       if ([self isMemberOfClass:[UIScrollView class]]) {
           NSLog(@"是 UIScrollView，注入自定义逻辑");

           // Hook scrollViewDidEndDecelerating: 方法
           Hook_Method(
               [delegate class],
               @selector(scrollViewDidEndDecelerating:),
               [self class],
               @selector(p_scrollViewDidEndDecelerating:),
               @selector(add_scrollViewDidEndDecelerating:)
           );

           // Hook scrollViewDidEndDragging:willDecelerate: 方法
           Hook_Method(
               [delegate class],
               @selector(scrollViewDidEndDragging:willDecelerate:),
               [self class],
               @selector(p_scrollViewDidEndDragging:willDecelerate:),
               @selector(add_scrollViewDidEndDragging:willDecelerate:)
           );
       } else {
           NSLog(@"不是 UIScrollView，跳过注入逻辑");
       }
   }

   #pragma mark - Replace Method

   // 替换 scrollViewDidEndDecelerating: 方法
   - (void)p_scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
       NSLog(@"%s", __func__);

       // 调用原始方法
       [self p_scrollViewDidEndDecelerating:scrollView];

       // 判断减速停止：手指未触摸 + 未拖拽 + 未减速
       BOOL scrollToScrollStop = !scrollView.tracking && !scrollView.dragging && !scrollView.decelerating;
       if (scrollToScrollStop) {
           [self stopScroll:scrollView];
       }
   }

   // 替换 scrollViewDidEndDragging:willDecelerate: 方法
   - (void)p_scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
       NSLog(@"%s", __func__);

       // 调用原始方法
       [self p_scrollViewDidEndDragging:scrollView willDecelerate:decelerate];

       if (!decelerate) {
           // 判断拖拽停止：手指触摸 + 未拖拽 + 未减速
           BOOL dragToDragStop = scrollView.tracking && !scrollView.dragging && !scrollView.decelerating;
           if (dragToDragStop) {
               [self stopScroll:scrollView];
           }
       }
   }

   #pragma mark - Add Method

   // 实现 scrollViewDidEndDecelerating: 方法
   - (void)add_scrollViewDidEndDecelerating:(UIScrollView *)scrollView {
       NSLog(@"%s", __func__);

       // 判断减速停止：手指未触摸 + 未拖拽 + 未减速
       BOOL scrollToScrollStop = !scrollView.tracking && !scrollView.dragging && !scrollView.decelerating;
       if (scrollToScrollStop) {
           [self stopScroll:scrollView];
       }
   }

   // 实现 scrollViewDidEndDragging:willDecelerate: 方法
   - (void)add_scrollViewDidEndDragging:(UIScrollView *)scrollView willDecelerate:(BOOL)decelerate {
       NSLog(@"%s", __func__);

       if (!decelerate) {
           // 判断拖拽停止：手指触摸 + 未拖拽 + 未减速
           BOOL dragToDragStop = scrollView.tracking && !scrollView.dragging && !scrollView.decelerating;
           if (dragToDragStop) {
               [self stopScroll:scrollView];
           }
       }
   }

   #pragma mark - 停止滚动的处理逻辑

   // 停止滚动时执行的统一处理逻辑
   - (void)stopScroll:(UIScrollView *)scrollView {
       NSLog(@"滚动停止事件触发，执行自定义逻辑");
       // 在此添加停止滚动时的处理代码，例如通知或回调
   }
   ```

3. 添加停止滚动的回调

   ```objc
   // 定义回调 block 类型
   typedef void(^ScrollStopBlock)(UIScrollView *scrollView);

   // 定义回调属性
   @property (nonatomic, copy, nullable) ScrollStopBlock stopScrollBlock;

   // 统一的停止回调方法
   - (void)stopScroll:(UIScrollView *)scrollView {
       if (self.stopScrollBlock) {
           // 确保回调在主线程执行
           dispatch_async(dispatch_get_main_queue(), ^{
               self.stopScrollBlock(scrollView);
           });
       }
   }
   ```

### 使用方式

经过上述封装，我们现在可以通过一种简洁的方式来监听滚动停止事件。下面通过一个完整而实用的示例来展示具体用法：

```objc
// 1. 创建并配置 ScrollView
UIScrollView *scrollView = [[UIScrollView alloc] init];
scrollView.frame = self.view.bounds;
scrollView.delegate = self;
[self.view addSubview:scrollView];

// 2. 配置滚动内容
UIView *contentView = [[UIView alloc] init];
// 设置内容视图宽度为屏幕宽度的3倍，便于横向滚动
contentView.frame = CGRectMake(0, 0, self.view.bounds.size.width * 3, self.view.bounds.size.height);
[scrollView addSubview:contentView];
scrollView.contentSize = contentView.frame.size;

// 3. 添加业务处理回调
scrollView.stopScrollBlock = ^(UIScrollView *scrollView) {
    // 在这里处理停止滚动后的业务逻辑
    NSLog(@"ScrollView停止滚动 - 当前偏移量: %@", NSStringFromCGPoint(scrollView.contentOffset));
};
```

通过以上简洁的配置，我们就实现了一个功能完备的滚动停止事件监听方案。这种实现方式具有以下显著优势：

1. **使用便捷**: 仅需设置一个 block 回调即可完成所有功能
2. **功能全面**: 自动处理拖拽停止、减速停止等多种滚动场景
3. **解耦设计**: 将滚动检测与业务逻辑完全分离
4. **易于维护**: 核心逻辑已封装，开发者只需关注业务实现
5. **扩展性强**: 可以方便地添加更多自定义处理逻辑

通过这种方式，开发者无需关心具体的停止滚动实现细节，可以将精力完全集中在业务逻辑开发上。

## 最后

本文详细介绍了如何通过 `Runtime` 实现一个监听 `UIScrollView` 停止滚动的方案。这种方式具有以下优势：

- 代码侵入性低，无需修改现有业务逻辑
- 使用方便直观，只需设置一个 `block` 回调
- 性能影响小，运行时开销可控
- 扩展性强，易于添加新功能

你在实际开发中是否遇到过类似的需求？欢迎在评论区分享你的经验和解决方案？
