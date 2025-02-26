# 如何解决 iOS 系统中 double 转 NSString 精度丢失问题

在日常开发中，后台经常返回带小数的数字，我们通常使用 `float` 或 `double` 类型来接收这些数据。然而，当我们将这些数字展示给用户时，可能会因为精度丢失而导致显示错误。

## 问题描述

假设后台返回的数据如下：

```json
{
  "double": 79.04
}
```

当我们将该数据解析为字典并转换为字符串时，可能会遇到精度丢失的问题。例如：

```objc
NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
NSString *result = [NSString stringWithFormat:@"%@", dic[@"double"]];

//期望结果："79.04"
//实际结果："79.04000000000001"
```

在这个例子中，后台返回的数字是 `79.04`，当我们将其转换为字符串时，期望的结果是 "79.04"，但实际结果却是 "79.04000000000001"。这就是精度丢失的表现。

## 原因分析

这种问题通常发生在直接使用 `double` 类型进行字符串转换时。由于 `double` 类型用于表示浮动小数，而它的二进制表示可能会产生精度误差，导致转化为字符串时出现不准确的结果。

## 解决办法

虽然可以通过控制小数位数来规避精度异常，但这种方法并不总是有效，因为我们无法预知后台返回的数字格式。

为了解决这一问题，可以使用 `NSDecimalNumber` 类，这是苹果提供的用于处理精确小数的类，它能有效避免精度丢失。

```objc
double d = [dic[@"double"] doubleValue];
NSString *dStr = [NSString stringWithFormat:@"%f", d];
NSDecimalNumber *dn = [NSDecimalNumber decimalNumberWithString:dStr];
NSString *result = [NSString stringWithFormat:@"%@", dn.stringValue];

//期望结果："79.04"
//实际结果："79.04"
```

可以看到，通过 `NSDecimalNumber` 转换后，精度问题得到了有效解决，结果与预期一致。

## 最后

在处理浮动小数时，尽量避免直接使用 `double` 类型进行字符串转换。使用 `NSDecimalNumber` 不仅能避免精度丢失问题，还能确保数据转换的精确性。

希望本篇文章能帮助你解决类似的精度问题，提升代码的稳定性和可靠性。
