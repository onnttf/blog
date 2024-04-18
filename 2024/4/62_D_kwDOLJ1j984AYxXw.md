---
author: Zhang Peng
category: 🙌 Show and tell
labels: 
discussion: https://github.com/onnttf/blog/discussions/62
updatedAt: 2024-04-18T18:35:35+08:00
---

# 日历订阅源指北：创建、发布、使用

# 日历订阅源指北：创建、发布、使用

![image](https://file.onnttf.site/2024/4/18/1.jpg)

在数字化时代，日历已经成为我们生活中不可或缺的一部分，助力我们合理安排时间、安排任务，并在重要事件来临时及时提醒我们。随着智能手机和电脑的普及，日历应用程序成为了不可或缺的工具。然而，随着信息量的增加和日程的复杂性，传统的手动输入日程的方式已经无法满足我们的需求。日历订阅源的出现填补了这一空缺，为我们提供了更为便捷的时间管理方式。本文将深入探讨日历订阅源的概念，并详细介绍如何创建、发布和使用它，以便更好地利用这一利器。

## 什么是日历订阅源

日历订阅源是一种通过网络发布的日历数据，通过订阅将各种类型的日程事件自动同步到个人日历中。用户可以订阅特定的日历，例如个人日程、假期、体育赛事、会议等，无需手动添加每一个事件，只需通过链接将日历添加到自己的日历应用中即可。这样一来，用户可以轻松地将外部日程和事件与自己的日历同步，无需手动添加，极大地方便了时间管理和日程安排。

## 常见的日历订阅源

### Exchange Calendar

[Exchange Calendar](https://support.microsoft.com/en-us/office/introduction-to-the-outlook-calendar-d94c5203-77c7-48ec-90a5-2e2bc10bd6f8) 是 `Microsoft Exchange` 提供的日历服务，通常与 `Microsoft Outlook` 配合使用。它提供了强大的团队协作功能，包括事件管理和日历共享等，使团队成员能够更加高效地协调和安排工作日程。

### CalDAV

[CalDAV](https://en.wikipedia.org/wiki/CalDAV) 是 [WebDAV](https://en.wikipedia.org/wiki/WebDAV) 的扩展，它为客户端访问远程服务器上的日历信息提供了标准，用于客户端访问和管理日历数据。[CalDAV](https://en.wikipedia.org/wiki/CalDAV) 可以与各种日历应用和服务集成，包括 `Google Calendar`、`Apple Calendar` 和 `Microsoft Outlook` 等。通过 [CalDAV](https://en.wikipedia.org/wiki/CalDAV)，用户可以实现实时更新、共享日历和访问权限管理等高级功能，为多人协作和组织日程带来了便利。

### iCalendar

[iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 是一种通用的日历数据交换格式，被广泛应用于日历应用程序之间的数据共享。 [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 文件的扩展名通常为 `.ical`、`.ics`、`.ifb` 或 `.iCalendar`。它优势在于简单易用，可以轻松地与各种日历应用程序和设备兼容。[iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 文件可以包含事件、任务、提醒以及其他日程安排，使其成为个人和团队日程管理的理想选择。

无论是 [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/)、[CalDAV](https://en.wikipedia.org/wiki/CalDAV) 还是 [Exchange Calendar](https://support.microsoft.com/en-us/office/introduction-to-the-outlook-calendar-d94c5203-77c7-48ec-90a5-2e2bc10bd6f8)，它们都是为了解决日程管理和共享而设计的不同技术方案。

- [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 作为通用的日历数据交换格式，适用于简单的日程共享和导入导出操作
- [CalDAV](https://en.wikipedia.org/wiki/CalDAV) 通过Web协议实现了跨平台和远程访问的日历同步
- [Exchange Calendar](https://support.microsoft.com/en-us/office/introduction-to-the-outlook-calendar-d94c5203-77c7-48ec-90a5-2e2bc10bd6f8) 则提供了更加完整和高级的日历服务，适用于企业和组织内部的日程安排和协作。

## 日历订阅源的制作及使用

接下来的内容中，我们将以油价调整时间为例，详细介绍如何制作一个 [iCalendar](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 格式的日历订阅源。

### iCalendar 的基本规范

`iCalendar` 文件是由一块块以 `BEGIN:` 开头、`END:` 结尾的部分组成。主体是 `VCALENDAR`，里面包罗了其他部分，比如说，有用来表示事件的 `VEVENT`，有用来标记待办事项的 `VTODO`，还有个 `VJOURNAL` 用来写日记，还有 `VTIMEZONE` 用来表示时区信息。同一种类型的部分允许荣富。比如，一个 `iCalendar` 文件里可以有多个描述不同事件的 `VEVENT`。

详细的规范可以通过查阅 [iCalendar - Design](https://en.wikipedia.org/wiki/iCalendar#Design) 或者 [iCalendar (RFC 5545)](https://iCalendar.org/RFC-Specifications/iCalendar-RFC-5545/) 自行学习。

### 编写日历订阅源

```text
BEGIN:VCALENDAR
PRODID:-//onnttf.site//油价调整时间表//CN
VERSION:2.0
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:油价调整时间表
X-WR-TIMEZONE:Asia/Shanghai
X-WR-CALDESC:油价调整时间表 更新时间：2024-04-18 16:12:34
BEGIN:VTIMEZONE
TZID:Asia/Shanghai
X-LIC-LOCATION:Asia/Shanghai
BEGIN:STANDARD
TZOFFSETFROM:+0800
TZOFFSETTO:+0800
TZNAME:CST
DTSTART:19700101T000000
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:20240103T000000_oilprice@onnttf.site
SUMMARY:油价调整
DESCRIPTION:第1次调整
DTSTART;VALUE=DATE:20240103
DTEND;VALUE=DATE:20240103
DTSTAMP:20240418T161234Z
STATUS:CONFIRMED
CREATED;TZID=Asia/Shanghai:20240418T161234
LAST-MODIFIED;TZID=Asia/Shanghai:20240418T161234
SEQUENCE:0
END:VEVENT
END:VCALENDAR
```

上面是一个简单的 `iCalendar` 文件，用来表示一次油价调整的情况。它包含了日历的基本信息、时区信息以及一个事件，让我们解读一下其中的信息：

- PRODID：该属性指定了生成此日历文件的产品标识符，通常以 `-//` 开头，其后是组织名或网站域名，最后是产品或服务的名称和语言代码。在我们的例子中，`PRODID` 为 `-//onnttf.site//油价调整时间表//CN`，表示此日历文件是由 `onnttf.site` 网站生成的油价调整时间表。

- VERSION： 指定了 `iCalendar` 规范的版本，这里是 `2.0`。

- CALSCALE：指定了日历的历法，`GREGORIAN` 表示使用公历。

- METHOD：指定了创建或更新日历数据的方法，这里是 `PUBLISH`，表示发布日历信息，即将日历数据发送给订阅者。

- VTIMEZONE：这部分定义了时区信息。在我们的例子中，时区被设置为 `Asia/Shanghai`。

- VEVENT：这部分定义了一个事件。在我们的例子中，事件是关于油价调整的信息。

  - UID：事件的唯一标识符。
  - SUMMARY：事件的摘要，简要描述了事件的内容。
  - DESCRIPTION：事件的详细描述。
  - DTSTART：事件的开始时间。
  - DTEND：事件的结束时间。
  - DTSTAMP：事件的时间戳。
  - STATUS：事件的状态，这里是CONFIRMED，表示事件已确认。
  - CREATED：事件的创建时间。
  - LAST-MODIFIED：事件的最后修改时间。
  - SEQUENCE：事件序列号

接下来，我们需要查询到油价调整时间，然后按照上面 `VEVENT` 的格式编写新的事件，然后保存至 `oil_price_adjustment.ics` 文件。

编写完成后，可以在 [iCalendar Validator](https://iCalendar.org/validator.html) 进行格式校验，以保证我们的文件没有错误。

### 发布日历订阅源

为了让别人能够方便地订阅油价调整时间表，我选择使用 [GitHub](https://github.com) 进行托管。只需要创建一个 `Public` 的仓库，然后将上面的 `oil_price_adjustment.ics` 上传进去即可。

将日历订阅源发布到云端而不是直接使用日历源文件主要出于便利性和实时更新的考虑。这样做可以让用户随时随地访问并订阅日历，同时实现即时更新，只需更新一次源文件，所有订阅者的日历就会自动同步更新，省去了手动更新的麻烦。云端发布还提供了更广泛的访问途径，用户可以通过各种设备和平台访问这些日历订阅源，使得信息的共享和传播更加便捷和高效。

### 使用日历订阅源

选择一个支持添加订阅源的日历软件，然后订阅上面日历订阅源的地址即可。

## 总结

我已经制作了一份 2024 年的油价调整时间表，并将其上传至[此仓库](https://github.com/onnttf/calendar/blob/main/oil_price_adjustment.ics)。我将持续更新该时间表，因此您可以直接订阅[此链接](https://raw.githubusercontent.com/onnttf/calendar/main/oil_price_adjustment.ics)。
