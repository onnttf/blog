const { graphql } = require('@octokit/graphql')
const { promises: fs } = require('fs')
const path = require('path')
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

const old_blog = [
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-09-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/09',
        key: '',
        labels: [],
        markdown_file_path: '2023/09/find-intersection-of-two-columns.md',
        title: 'Excel 教程：如何使用公式取两列的交集',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-07-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/07',
        key: '',
        labels: [],
        markdown_file_path: '2023/07/parse-bookmarks.md',
        title: '掌握书签文件：高效管理收藏',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-03-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/03',
        key: '',
        labels: [],
        markdown_file_path: '2023/03/shebang.md',
        title: '如何构建 docker 镜像',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/02',
        key: '',
        labels: [],
        markdown_file_path: '2023/02/housing-provident-fund.md',
        title: '变更住房公积金提取周期',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/02',
        key: '',
        labels: [],
        markdown_file_path: '2023/02/introduction-to-shell.md',
        title: 'Shell 入门教程',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/02',
        key: '',
        labels: [],
        markdown_file_path: '2023/02/how-to-create-image.md',
        title: '如何构建 docker 镜像',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2023-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2023/02',
        key: '',
        labels: [],
        markdown_file_path: '2023/02/solidity.md',
        title: 'Solidity 从入门到放弃',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-10-09T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/10',
        key: '',
        labels: [],
        markdown_file_path: '2022/10/hello-jwt.md',
        title: '你好，jwt',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-03-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/03',
        key: '',
        labels: [],
        markdown_file_path: '2022/09/keep-alive-ssh.md',
        title: '如何保持 SSH 服务不掉线',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-08-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/08',
        key: '',
        labels: [],
        markdown_file_path: '2022/08/web3.md',
        title: 'web3',
        updated_at: '2023-06-16T06:04:36+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-06-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/06',
        key: '',
        labels: [],
        markdown_file_path: '2022/06/simple-dynamic-string.md',
        title: '简单动态字符串',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-06-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/06',
        key: '',
        labels: [],
        markdown_file_path: '2022/06/tips-for-git.md',
        title: 'git 使用小技巧',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-06-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/06',
        key: '',
        labels: [],
        markdown_file_path: '2022/06/set-file-default-opening-mode.md',
        title: 'macOS 设置文件的默认打开程序',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-03-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/03',
        key: '',
        labels: [],
        markdown_file_path: '2022/03/bit-operation.md',
        title: '神奇的位运算',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/02',
        key: '',
        labels: [],
        markdown_file_path: '2022/02/generate-table-struct.md',
        title: '快速生成表结构的结构体',
        updated_at: '2023-11-09T10:52:41+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/02',
        key: '',
        labels: [],
        markdown_file_path: '2022/02/update-git-version.md',
        title: 'macOS 升级 Git 版本',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-02-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/02',
        key: '',
        labels: [],
        markdown_file_path: '2022/02/create-personal-module.md',
        title: '如何创建自己 module',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2022-01-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2022/01',
        key: '',
        labels: [],
        markdown_file_path: '2022/01/linux-file-permissions.md',
        title: '搞懂 Linux 的文件权限',
        updated_at: '2023-11-09T10:52:41+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2021-12-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2021/12',
        key: '',
        labels: [],
        markdown_file_path: '2021/12/show-hidden-files.md',
        title: 'macOS 系统显示隐藏文件',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2021-12-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2021/12',
        key: '',
        labels: [],
        markdown_file_path: '2021/12/remove-password-limit.md',
        title: '解除 macOS 系统的密码限制',
        updated_at: '2023-10-19T23:04:21+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2021-12-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2021/12',
        key: '',
        labels: [],
        markdown_file_path: '2021/12/modify-git-configuration.md',
        title: '如何修改 git 配置',
        updated_at: '2023-11-09T10:52:41+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2021-09-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2021/09',
        key: '',
        labels: [],
        markdown_file_path: '2021/09/setup-and-use.md',
        title: '安装与使用',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2021-07-22T08:00:00+08:00',
        discussion_file_path: '',
        group: '2021/07',
        key: '',
        labels: [],
        markdown_file_path: '2021/07/resolve-port-occupancy.md',
        title: '如何解决端口占用问题',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2021-06-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2021/06',
        key: '',
        labels: [],
        markdown_file_path: '2021/06/const.md',
        title: '修饰符 const',
        updated_at: '2023-11-09T10:43:50+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-12-01T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/12',
        key: '',
        labels: [],
        markdown_file_path: '2020/12/install-nodejs.md',
        title: 'Ubuntu 安装 NodeJS',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-10-04T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/10',
        key: '',
        labels: [],
        markdown_file_path: '2020/10/configure-mac.md',
        title: 'Mac 的开机设置',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-08-24T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/08',
        key: '',
        labels: [],
        markdown_file_path: '2020/08/install-flutter.md',
        title: 'Flutter 安装和环境配置',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-07-28T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/07',
        key: '',
        labels: [],
        markdown_file_path: '2020/07/clean-up-git-repository.md',
        title: '如何清理 Git 仓库',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-07-22T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/07',
        key: '',
        labels: [],
        markdown_file_path: '2020/07/judge-algorithm-quality.md',
        title: '如何评判算法好坏',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-05-26T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/05',
        key: '',
        labels: [],
        markdown_file_path: '2020/05/authenticating-with-the-app-store.md',
        title: '上传应用时，卡在 Authenticating with the App Store',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2020-05-07T08:00:00+08:00',
        discussion_file_path: '',
        group: '2020/05',
        key: '',
        labels: [],
        markdown_file_path: '2020/05/go-command.md',
        title: 'Go 1.13 中 Go command 修改',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-12-05T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/12',
        key: '',
        labels: [],
        markdown_file_path: '2019/12/initializer.md',
        title: '类的初始化方法',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-07-20T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/07',
        key: '',
        labels: [],
        markdown_file_path: '2019/07/go.md',
        title: 'Go 基础',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-06-21T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/06',
        key: '',
        labels: [],
        markdown_file_path: '2019/06/create-pod.md',
        title: '如何创建一个公有 Pod 库',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-04-03T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/04',
        key: '',
        labels: [],
        markdown_file_path: '2019/04/install-mysql.md',
        title: 'Ubuntu 安装 MySQL',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-04-15T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/04',
        key: '',
        labels: [],
        markdown_file_path: '2019/04/sandbox.md',
        title: 'App 沙盒',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-03-26T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/03',
        key: '',
        labels: [],
        markdown_file_path: '2019/03/introduction-to-restful.md',
        title: 'RESTful 笔记',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-03-10T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/03',
        key: '',
        labels: [],
        markdown_file_path: '2019/03/block-statement.md',
        title: 'Block 的声明方式',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-03-11T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/03',
        key: '',
        labels: [],
        markdown_file_path: '2019/03/load-and-initialize.md',
        title: '+load 与 +initialize',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2019-01-02T08:00:00+08:00',
        discussion_file_path: '',
        group: '2019/01',
        key: '',
        labels: [],
        markdown_file_path: '2019/01/install-charles-certificate.md',
        title: 'Charles 安装证书',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-12-18T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/12',
        key: '',
        labels: [],
        markdown_file_path: '2018/12/a-better-terminal.md',
        title: 'iTerm2 一个更好用的终端',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-12-08T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/12',
        key: '',
        labels: [],
        markdown_file_path: '2018/12/rac-eventbus-rxjava.md',
        title: 'Rac EventBus RxJava',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-07-03T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/07',
        key: '',
        labels: [],
        markdown_file_path: '2018/07/sirikit.md',
        title: 'SiriKit 人机界面指南',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-07-10T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/07',
        key: '',
        labels: [],
        markdown_file_path: '2018/07/dynamic-icon.md',
        title: '动态更换 App 图标',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-06-16T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/06',
        key: '',
        labels: [],
        markdown_file_path: '2018/06/reinstall-mac-system.md',
        title: 'macOS 系统重装',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-05-29T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/05',
        key: '',
        labels: [],
        markdown_file_path: '2018/05/gcd.md',
        title: 'GCD 同步异步与串行并行',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-05-24T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/05',
        key: '',
        labels: [],
        markdown_file_path: '2018/05/cocoapods.md',
        title: 'CocoaPods 安装及错误处理',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-05-23T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/05',
        key: '',
        labels: [],
        markdown_file_path: '2018/05/introduction-to-applescript.md',
        title: 'AppleScript 入门与实践',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-04-02T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/04',
        key: '',
        labels: [],
        markdown_file_path: '2018/04/message-forwarding.md',
        title: 'iOS 消息转发机制',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-03-10T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/03',
        key: '',
        labels: [],
        markdown_file_path: '2018/03/nsmethodsignature-nsinvocation.md',
        title: 'NSMethodSignature 和 NSInvocation',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-02-09T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/02',
        key: '',
        labels: [],
        markdown_file_path: '2018/02/build-failed.md',
        title: '常见的编译失败',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-02-24T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/02',
        key: '',
        labels: [],
        markdown_file_path: '2018/02/uri-url-urn.md',
        title: 'URI、URL、URN 的差异与联系',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2018-01-14T08:00:00+08:00',
        discussion_file_path: '',
        group: '2018/01',
        key: '',
        labels: [],
        markdown_file_path: '2018/01/hook-system-delegate-method.md',
        title: 'Hook 系统代理方法',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-12-03T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/12',
        key: '',
        labels: [],
        markdown_file_path: '2017/12/wkwebview.md',
        title: 'WKWebView 使用及注意事项',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-12-15T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/12',
        key: '',
        labels: [],
        markdown_file_path: '2017/12/create-qr-code.md',
        title: '二维码生成及定制',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-11-09T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/11',
        key: '',
        labels: [],
        markdown_file_path: '2017/11/interview.md',
        title: '面试啊面试~',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-11-26T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/11',
        key: '',
        labels: [],
        markdown_file_path: '2017/11/set-up-hexo-blog.md',
        title: '搭建 Hexo Blog',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-09-08T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/09',
        key: '',
        labels: [],
        markdown_file_path: '2017/09/double-to-nsstring.md',
        title: 'double 转 NSString 出现精度异常',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-09-07T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/09',
        key: '',
        labels: [],
        markdown_file_path: '2017/09/widget-development.md',
        title: 'Widget 开发 - 开发篇',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-08-29T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/08',
        key: '',
        labels: [],
        markdown_file_path: '2017/08/widget-configuration.md',
        title: 'Widget 开发 - 配置篇',
        updated_at: '2023-11-20T19:54:49+08:00'
    },
    {
        author: 'Zhang Peng',
        category: {
            emoji: ':raised_hands:',
            emojiHTML: '<div>🙌</div>',
            id: 'DIC_kwDOLJ1j984CctHm',
            name: 'Show and tell',
            slug: 'show-and-tell',
            url: 'https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=',
            display: '🙌 Show and tell'
        },
        created_at: '2017-08-29T08:00:00+08:00',
        discussion_file_path: '',
        group: '2017/08',
        key: '',
        labels: [],
        markdown_file_path: '2017/08/read-pdf-with-cryptographic-seal.md',
        title: '读取一个带有加密印章的 PDF',
        updated_at: '2023-11-20T19:54:49+08:00'
    }
]

const DISCUSSIONS_QUERY = `
        query get_discussions(
          $owner: String!,
          $repo: String!,
          $after: String,
          $limit: Int = 10
        ) {
          repository(owner: $owner, name: $repo) {
            discussions(first: $limit, after: $after) {
              pageInfo {
                endCursor
                startCursor
                hasNextPage
              }
              nodes {
                id
                labels(first: 10) {
                  nodes {
                    id
                    name
                    resourcePath
                    url
                  }
                }
                category {
                  id
                  name
                  emoji
                  emojiHTML
                  slug
                }
                number
                title
                body
                author {
                  login
                }
                authorAssociation
                createdAt
                updatedAt
                repository {
                  id
                  url
                  resourcePath
                }
                url
                resourcePath
              }
            }
          }
        }
      `

async function fetchDiscussions(token, owner, repo, limit = 30) {
    const allDiscussions = []
    let hasMore = true
    let afterCursor = null

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    })

    while (hasMore) {
        try {
            const response = await graphqlWithAuth(DISCUSSIONS_QUERY, {
                owner,
                repo,
                after: afterCursor,
                limit
            })

            const discussions = response.repository.discussions.nodes
            allDiscussions.push(...discussions)
            const pageInfo = response.repository.discussions.pageInfo
            hasMore = pageInfo.hasNextPage
            afterCursor = pageInfo.endCursor
        } catch (error) {
            console.log(
                'Error fetching discussions for owner:',
                owner,
                ', repo:',
                repo,
                ', error:',
                error.message
            )
            throw error
        }
    }

    const discussionMap = new Map()

    for (const v of allDiscussions) {
        const key = `${v.number}_${v.id}`
        const existing = discussionMap.get(key)

        if (existing && dayjs(existing.updatedAt).isAfter(dayjs(v.updatedAt))) {
            continue
        }

        discussionMap.set(key, v)
    }
    return Array.from(discussionMap.values())
}

async function publishDiscussion(token, owner, repo, limit = 30) {
    const allDiscussions = []
    let hasMore = true
    let afterCursor = null

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    })

    const DISCUSSIONS_QUERY = `
        query get_discussions(
          $owner: String!,
          $repo: String!,
          $after: String,
          $limit: Int = 10
        ) {
          repository(owner: $owner, name: $repo) {
            discussions(first: $limit, after: $after) {
              pageInfo {
                endCursor
                startCursor
                hasNextPage
              }
              nodes {
                id
                labels(first: 10) {
                  nodes {
                    id
                    name
                    resourcePath
                    url
                  }
                }
                category {
                  id
                  name
                  emoji
                  emojiHTML
                  slug
                }
                number
                title
                body
                author {
                  login
                }
                authorAssociation
                createdAt
                updatedAt
                repository {
                  id
                  url
                  resourcePath
                }
                url
                resourcePath
              }
            }
          }
        }
      `

    while (hasMore) {
        try {
            const response = await graphqlWithAuth(DISCUSSIONS_QUERY, {
                owner,
                repo,
                after: afterCursor,
                limit
            })

            const discussions = response.repository.discussions.nodes
            allDiscussions.push(...discussions)
            const pageInfo = response.repository.discussions.pageInfo
            hasMore = pageInfo.hasNextPage
            afterCursor = pageInfo.endCursor
        } catch (error) {
            console.log(
                'Error fetching discussions for owner:',
                owner,
                ', repo:',
                repo,
                ', error:',
                error.message
            )
            throw error
        }
    }

    return allDiscussions
}

module.exports = {
    old_blog: old_blog,
    fetchDiscussions: fetchDiscussions,
    publishDiscussion: publishDiscussion
}
