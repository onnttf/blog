const { graphql } = require("@octokit/graphql");
const { promises: fs } = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const DISCUSSION_CATEGORY_ANNOUNCEMENTS = "announcements";
const DISCUSSION_CATEGORY_SHOWANDTELL = "show-and-tell";

const categoryOrder = {
  [DISCUSSION_CATEGORY_ANNOUNCEMENTS]: -1,
  [DISCUSSION_CATEGORY_SHOWANDTELL]: 1,
};

const old = [
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-09-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/09",
    key: "f05fc214d0d8dbff2b692e421fcffffb",
    labels: [],
    markdown_file_path: "2023/09/find-intersection-of-two-columns.md",
    title: "Excel 教程：如何使用公式取两列的交集",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-07-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/07",
    key: "9ad9207c9d3505f05ba07e683cdebae2",
    labels: [],
    markdown_file_path: "2023/07/parse-bookmarks.md",
    title: "掌握书签文件：高效管理收藏",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-03-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/03",
    key: "fac21331ec8640506840363c7fb28a42",
    labels: [],
    markdown_file_path: "2023/03/shebang.md",
    title: "如何构建 docker 镜像",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/02",
    key: "d9896e31f55a5bc5dae1858ce6f8bf66",
    labels: [],
    markdown_file_path: "2023/02/housing-provident-fund.md",
    title: "变更住房公积金提取周期",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/02",
    key: "d46b88bebcfc3339217ff78312cae55c",
    labels: [],
    markdown_file_path: "2023/02/introduction-to-shell.md",
    title: "Shell 入门教程",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/02",
    key: "eece52d16de0ee4785a5e7f59e5673a8",
    labels: [],
    markdown_file_path: "2023/02/how-to-create-image.md",
    title: "如何构建 docker 镜像",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2023-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2023/02",
    key: "c7b9238d7183f95d18c1a13adbe36747",
    labels: [],
    markdown_file_path: "2023/02/solidity.md",
    title: "Solidity 从入门到放弃",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-10-09T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/10",
    key: "e256ffc5785bad9c7427a25ddb93a2ef",
    labels: [],
    markdown_file_path: "2022/10/hello-jwt.md",
    title: "你好，jwt",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-03-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/03",
    key: "917e1de5c77e74fe4b4a18b228fae6f8",
    labels: [],
    markdown_file_path: "2022/09/keep-alive-ssh.md",
    title: "如何保持 SSH 服务不掉线",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-08-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/08",
    key: "edca2f5e8ea5e089ba0a47355e39b548",
    labels: [],
    markdown_file_path: "2022/08/web3.md",
    title: "web3",
    updated_at: "2023-06-16T06:04:36+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-06-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/06",
    key: "c9430539d1b48831ae9f1f80b875ccf5",
    labels: [],
    markdown_file_path: "2022/06/simple-dynamic-string.md",
    title: "简单动态字符串",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-06-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/06",
    key: "31dd454869a1aebf2b66c4229fd3ee8f",
    labels: [],
    markdown_file_path: "2022/06/tips-for-git.md",
    title: "git 使用小技巧",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-06-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/06",
    key: "df08f126b357006991c02475a0c91f5e",
    labels: [],
    markdown_file_path: "2022/06/set-file-default-opening-mode.md",
    title: "macOS 设置文件的默认打开程序",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-03-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/03",
    key: "21eb0666c494fc601b1b85ffffdcb665",
    labels: [],
    markdown_file_path: "2022/03/bit-operation.md",
    title: "神奇的位运算",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/02",
    key: "b5ad050a34cf3f8617b5936a0e688c25",
    labels: [],
    markdown_file_path: "2022/02/generate-table-struct.md",
    title: "快速生成表结构的结构体",
    updated_at: "2023-11-09T10:52:41+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/02",
    key: "c78fd9ba49bc8c9325c9ae1d50c59b87",
    labels: [],
    markdown_file_path: "2022/02/update-git-version.md",
    title: "macOS 升级 Git 版本",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-02-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/02",
    key: "e25392957c15d39409737a48274af211",
    labels: [],
    markdown_file_path: "2022/02/create-personal-module.md",
    title: "如何创建自己 module",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2022-01-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2022/01",
    key: "de11667696bca3bef208e1731674c576",
    labels: [],
    markdown_file_path: "2022/01/linux-file-permissions.md",
    title: "搞懂 Linux 的文件权限",
    updated_at: "2023-11-09T10:52:41+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2021-12-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2021/12",
    key: "f8fd8ede7bcdf613f5b913b0b45f777a",
    labels: [],
    markdown_file_path: "2021/12/show-hidden-files.md",
    title: "macOS 系统显示隐藏文件",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2021-12-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2021/12",
    key: "d40337d440acfd149f2f4d0e5304a5df",
    labels: [],
    markdown_file_path: "2021/12/remove-password-limit.md",
    title: "解除 macOS 系统的密码限制",
    updated_at: "2023-10-19T23:04:21+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2021-12-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2021/12",
    key: "8254f58485199d6e3677ce2abb8f4cfa",
    labels: [],
    markdown_file_path: "2021/12/modify-git-configuration.md",
    title: "如何修改 git 配置",
    updated_at: "2023-11-09T10:52:41+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2021-09-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2021/09",
    key: "f0457bd8fcf0f56e8a2f9a0e34cdedd1",
    labels: [],
    markdown_file_path: "2021/09/setup-and-use.md",
    title: "安装与使用",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2021-07-22T08:00:00+08:00",
    discussion_file_path: "",
    group: "2021/07",
    key: "f719d9334d09519df6280d9a41049c06",
    labels: [],
    markdown_file_path: "2021/07/resolve-port-occupancy.md",
    title: "如何解决端口占用问题",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2021-06-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2021/06",
    key: "eb10ec6543f5d32a5ed814ca810a6e4e",
    labels: [],
    markdown_file_path: "2021/06/const.md",
    title: "修饰符 const",
    updated_at: "2023-11-09T10:43:50+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-12-01T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/12",
    key: "96b62440967e098d8b8428ef2b61fa96",
    labels: [],
    markdown_file_path: "2020/12/install-nodejs.md",
    title: "Ubuntu 安装 NodeJS",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-10-04T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/10",
    key: "bb9fb836e4837832015975b299d1c11a",
    labels: [],
    markdown_file_path: "2020/10/configure-mac.md",
    title: "Mac 的开机设置",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-08-24T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/08",
    key: "5419078a650337ec4bbad14634c6fb90",
    labels: [],
    markdown_file_path: "2020/08/install-flutter.md",
    title: "Flutter 安装和环境配置",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-07-28T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/07",
    key: "b8b0f35dc5250bd6e35bce534d1bd8c5",
    labels: [],
    markdown_file_path: "2020/07/clean-up-git-repository.md",
    title: "如何清理 Git 仓库",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-07-22T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/07",
    key: "a72d8838891c218b60eaa31be0152dcc",
    labels: [],
    markdown_file_path: "2020/07/judge-algorithm-quality.md",
    title: "如何评判算法好坏",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-05-26T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/05",
    key: "64d6a99b8abf901292edc72c769f805d",
    labels: [],
    markdown_file_path: "2020/05/authenticating-with-the-app-store.md",
    title: "上传应用时，卡在 Authenticating with the App Store",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2020-05-07T08:00:00+08:00",
    discussion_file_path: "",
    group: "2020/05",
    key: "8550b8a6c8d0b7283ea17ef33518c09f",
    labels: [],
    markdown_file_path: "2020/05/go-command.md",
    title: "Go 1.13 中 Go command 修改",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-12-05T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/12",
    key: "b4f551e39b877b659e951a4aba4cabe2",
    labels: [],
    markdown_file_path: "2019/12/initializer.md",
    title: "类的初始化方法",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-07-20T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/07",
    key: "fa89fe644b7f96fdc823ae63014e747e",
    labels: [],
    markdown_file_path: "2019/07/go.md",
    title: "Go 基础",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-06-21T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/06",
    key: "44e984724a58ccff4281052fec1a562c",
    labels: [],
    markdown_file_path: "2019/06/create-pod.md",
    title: "如何创建一个公有 Pod 库",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-04-03T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/04",
    key: "28f4591977bf0acfa63491844584a26a",
    labels: [],
    markdown_file_path: "2019/04/install-mysql.md",
    title: "Ubuntu 安装 MySQL",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-04-15T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/04",
    key: "128a847fb239a56be066b062f49e52b7",
    labels: [],
    markdown_file_path: "2019/04/sandbox.md",
    title: "App 沙盒",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-03-26T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/03",
    key: "13fff3f81412d2fa4339474e34181cb6",
    labels: [],
    markdown_file_path: "2019/03/introduction-to-restful.md",
    title: "RESTful 笔记",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-03-10T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/03",
    key: "52a954c221eb99baf1cf8e030a164f88",
    labels: [],
    markdown_file_path: "2019/03/block-statement.md",
    title: "Block 的声明方式",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-03-11T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/03",
    key: "0b4f77508ab4a613ef69d44c2a1ba7e5",
    labels: [],
    markdown_file_path: "2019/03/load-and-initialize.md",
    title: "+load 与 +initialize",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2019-01-02T08:00:00+08:00",
    discussion_file_path: "",
    group: "2019/01",
    key: "6acbc4cdc67e221e58dd3725c0d2f9b8",
    labels: [],
    markdown_file_path: "2019/01/install-charles-certificate.md",
    title: "Charles 安装证书",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-12-18T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/12",
    key: "bc78651f082d4677bdabfffa5f5c11c1",
    labels: [],
    markdown_file_path: "2018/12/a-better-terminal.md",
    title: "iTerm2 一个更好用的终端",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-12-08T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/12",
    key: "d189b8e085f49ea4b76cc55b2563f312",
    labels: [],
    markdown_file_path: "2018/12/rac-eventbus-rxjava.md",
    title: "Rac EventBus RxJava",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-07-03T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/07",
    key: "3dabe708ab5506c5d337d1ffd8a6072a",
    labels: [],
    markdown_file_path: "2018/07/sirikit.md",
    title: "SiriKit 人机界面指南",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-07-10T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/07",
    key: "3b3989e866d1ea68d4a2014d3228baf5",
    labels: [],
    markdown_file_path: "2018/07/dynamic-icon.md",
    title: "动态更换 App 图标",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-06-16T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/06",
    key: "88e8612343480cef4f4597493748458d",
    labels: [],
    markdown_file_path: "2018/06/reinstall-mac-system.md",
    title: "macOS 系统重装",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-05-29T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/05",
    key: "5ddb41381008cf49665892d68855a586",
    labels: [],
    markdown_file_path: "2018/05/gcd.md",
    title: "GCD 同步异步与串行并行",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-05-24T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/05",
    key: "21b8ec1e53cf805d99644f2f1f473cc3",
    labels: [],
    markdown_file_path: "2018/05/cocoapods.md",
    title: "CocoaPods 安装及错误处理",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-05-23T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/05",
    key: "a69a7d5a677752260207efe88f3ad959",
    labels: [],
    markdown_file_path: "2018/05/introduction-to-applescript.md",
    title: "AppleScript 入门与实践",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-04-02T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/04",
    key: "2e3a8e8fd3781edd70fb4cb10ead7b86",
    labels: [],
    markdown_file_path: "2018/04/message-forwarding.md",
    title: "iOS 消息转发机制",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-03-10T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/03",
    key: "c404d147dbebff1300dd6cf3ca9724b0",
    labels: [],
    markdown_file_path: "2018/03/nsmethodsignature-nsinvocation.md",
    title: "NSMethodSignature 和 NSInvocation",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-02-09T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/02",
    key: "8381778e145cafc9ec81f16ed0419015",
    labels: [],
    markdown_file_path: "2018/02/build-failed.md",
    title: "常见的编译失败",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-02-24T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/02",
    key: "abfd934dfa152ee4a77ec0946c8ee8d8",
    labels: [],
    markdown_file_path: "2018/02/uri-url-urn.md",
    title: "URI、URL、URN 的差异与联系",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2018-01-14T08:00:00+08:00",
    discussion_file_path: "",
    group: "2018/01",
    key: "c747a57aa9831c648e5600bf51228a84",
    labels: [],
    markdown_file_path: "2018/01/hook-system-delegate-method.md",
    title: "Hook 系统代理方法",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-12-03T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/12",
    key: "8fc60bc757345a27a1957e80fe864dc9",
    labels: [],
    markdown_file_path: "2017/12/wkwebview.md",
    title: "WKWebView 使用及注意事项",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-12-15T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/12",
    key: "1a1bc4b16fd17c5d6e7902dec8eb8e59",
    labels: [],
    markdown_file_path: "2017/12/create-qr-code.md",
    title: "二维码生成及定制",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-11-09T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/11",
    key: "45e5f265a9a110ed9d777c052a762dab",
    labels: [],
    markdown_file_path: "2017/11/interview.md",
    title: "面试啊面试~",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-11-26T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/11",
    key: "4213b68547e080376dc12e7b33d1578a",
    labels: [],
    markdown_file_path: "2017/11/set-up-hexo-blog.md",
    title: "搭建 Hexo Blog",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-09-08T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/09",
    key: "a6e780f3f7d5d6c7569382687783ece5",
    labels: [],
    markdown_file_path: "2017/09/double-to-nsstring.md",
    title: "double 转 NSString 出现精度异常",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-09-07T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/09",
    key: "b51b05b3433b51ee5b55a8292d8032d3",
    labels: [],
    markdown_file_path: "2017/09/widget-development.md",
    title: "Widget 开发 - 开发篇",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-08-29T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/08",
    key: "7dd5d6b032a7250c32a25358be501e00",
    labels: [],
    markdown_file_path: "2017/08/widget-configuration.md",
    title: "Widget 开发 - 配置篇",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
  {
    author: "Zhang Peng",
    category: {
      emoji: ":raised_hands:",
      emojiHTML: "<div>🙌</div>",
      id: "DIC_kwDOLJ1j984CctHm",
      name: "Show and tell",
      slug: "show-and-tell",
      url: "https://github.com//onnttf/blog/discussions/categories/show-and-tell?discussions_q=",
      display: "🙌 Show and tell",
    },
    created_at: "2017-08-29T08:00:00+08:00",
    discussion_file_path: "",
    group: "2017/08",
    key: "f784366b07e0c84e163a27ed905b319d",
    labels: [],
    markdown_file_path: "2017/08/read-pdf-with-cryptographic-seal.md",
    title: "读取一个带有加密印章的 PDF",
    updated_at: "2023-11-20T19:54:49+08:00",
  },
];

async function writeToFileSync(filePath, data) {
  try {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, data);
  } catch (error) {
    console.log(`Error writing file ${filePath}, error: ${error.message}`);
    throw error;
  }
}

async function fetchDiscussions(token, owner, repo, limit = 30) {
  const allDiscussions = [];
  let hasMore = true;
  let afterCursor = null;

  const graphqlWithAuth = graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });

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
      `;

  while (hasMore) {
    try {
      const response = await graphqlWithAuth(DISCUSSIONS_QUERY, {
        owner,
        repo,
        after: afterCursor,
        limit,
      });

      const discussions = response.repository.discussions.nodes;
      allDiscussions.push(...discussions);
      const pageInfo = response.repository.discussions.pageInfo;
      hasMore = pageInfo.hasNextPage;
      afterCursor = pageInfo.endCursor;
    } catch (error) {
      console.log(
        "Error fetching discussions for owner:",
        owner,
        ", repo:",
        repo,
        ", error:",
        error.message
      );
      throw error;
    }
  }

  return allDiscussions;
}

function buildArchiveObject(discussion) {
  const createdAtInCST = dayjs(discussion.createdAt).utcOffset(8);
  const updatedAtInCST = dayjs(discussion.updatedAt).utcOffset(8);

  const year = createdAtInCST.year();
  const month = createdAtInCST.month() + 1;

  const key = `${discussion.number}_${discussion.id}`;
  const category = discussion.category;

  const archiveObject = {
    key,
    title: discussion.title.trim(),
    category: {
      emoji: category.emoji,
      emojiHTML: category.emojiHTML,
      id: category.id,
      name: category.name,
      slug: category.slug,
      url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/discussions/categories/${category.slug}?discussions_q=`,
      display: `${
        category.emojiHTML ? category.emojiHTML.match(/>(.*?)</)?.[1] + " " : ""
      }${category.name || ""}`,
    },
    labels: discussion.labels.nodes
      ? discussion.labels.nodes.map((label) => ({
          id: label.id,
          name: label.name,
          url: `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/discussions?discussions_q=label%3A${label.name}`,
        }))
      : [],
    group:
      category.slug !== DISCUSSION_CATEGORY_ANNOUNCEMENTS
        ? `${year}/${month}`
        : category.name,
    // author: discussion.author.login,
    author: "Zhang Peng",
    discussion_url: discussion.url,
    discussion_file_path: `discussions/${year}/${month}/${key}.json`,
    markdown_file_path: `${year}/${month}/${key}.md`,
    created_at: createdAtInCST.format(),
    updated_at: updatedAtInCST.format(),
  };

  return archiveObject;
}

async function main() {
  const [username, repoName] = GITHUB_REPOSITORY.split("/");

  console.log("Fetching discussions...");
  const allDiscussions = await fetchDiscussions(
    GITHUB_TOKEN,
    username,
    repoName
  );
  console.log("Fetched", allDiscussions.length, " discussions.");

  const discussionMap = new Map();

  for (const v of allDiscussions) {
    if (v.authorAssociation !== "OWNER") {
      continue;
    }

    const key = `${v.number}_${v.id}`;
    const existing = discussionMap.get(key);

    if (existing && dayjs(existing.updatedAt).isAfter(dayjs(v.updatedAt))) {
      continue;
    }

    discussionMap.set(key, v);
  }

  const finalDiscussions = Array.from(discussionMap.values());
  const category2ArchiveObjects = {
    old: old,
  };
  const key2Discussion = {};

  for (const v of finalDiscussions) {
    const archiveObject = buildArchiveObject(v);
    key2Discussion[archiveObject.key] = v;

    const categorySlug = archiveObject.category.slug || "default";

    if (!category2ArchiveObjects[categorySlug]) {
      category2ArchiveObjects[categorySlug] = [];
    }

    category2ArchiveObjects[categorySlug].push(archiveObject);
  }

  for (const categorySlug in category2ArchiveObjects) {
    category2ArchiveObjects[categorySlug].sort((a, b) => {
      if (a.updated_at === b.updated_at) {
        const createdAtA = dayjs(a.created_at);
        const createdAtB = dayjs(b.created_at);
        return createdAtB.diff(createdAtA);
      }
      const updatedAtA = dayjs(a.updated_at);
      const updatedAtB = dayjs(b.updated_at);
      return updatedAtB.diff(updatedAtA);
    });
  }

  const sortedDiscussions = Object.keys(category2ArchiveObjects)
    .sort((a, b) => {
      const orderA = categoryOrder[a] || Number.MAX_SAFE_INTEGER;
      const orderB = categoryOrder[b] || Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    })
    .map((category) => category2ArchiveObjects[category] || [])
    .flat();

  const writePromises = [];
  const readmeContents = [];
  const summaryContents = {};

  writePromises.push(
    writeToFileSync(
      "archive_data.json",
      JSON.stringify(sortedDiscussions, null, 2)
    )
  );

  for (const v of sortedDiscussions) {
    const discussion = key2Discussion[v.key];
    if (!discussion) {
      continue;
    }
    writePromises.push(
      writeToFileSync(
        v.discussion_file_path,
        JSON.stringify(discussion, null, 2)
      )
    );

    const labels = v.labels.map((label) => label.name).join(", ");

    const metadata = {
      author: v.author,
      category: v.category.display,
      labels: labels,
      discussion: v.discussion_url,
      updatedAt: v.updated_at,
    };

    const frontMatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const markdownTitle = `# ${discussion.title.trim()}`;
    const markdownBody = discussion.body.trim();

    const markdownData = `---\n${frontMatter}\n---\n\n${markdownTitle}\n\n${markdownBody}\n`;

    writePromises.push(writeToFileSync(v.markdown_file_path, markdownData));
  }

  for (const v of sortedDiscussions) {
    const categoryInREADME = v.category.id
      ? `[${v.category.display}](${v.category.url})`
      : "-";
    const labelsInREADME = v.labels
      .map((label) => `[${label.name}](${label.url})`)
      .join(", ");
    readmeContents.push([
      categoryInREADME || "-",
      `[${v.title}](${v.markdown_file_path})`,
      labelsInREADME || "-",
      v.updated_at || "-",
    ]);
    const contents = summaryContents[v.group] || [];
    contents.push(`[${v.title}](${v.markdown_file_path})`);
    summaryContents[v.group] = contents;
  }

  let README = "# README\n\n";
  README += "Just a repository for blogs. :)\n\n";
  README += "## Table of Contents\n\n";
  README += "| Category | Article | Labels | Last Updated |\n";
  README += "| --- | --- | --- | --- |\n";

  readmeContents.forEach((v) => {
    README += `| ${v[0]} | ${v[1]} | ${v[2]} | ${v[3]} |\n`;
  });

  README += "\n如果觉得文章不错，可以关注公众号哟！\n\n";
  README += "![干货输出机](https://file.onnttf.site/wechat/qrcode.jpg)\n";

  writePromises.push(writeToFileSync("README.md", README));

  const groups = Object.keys(summaryContents).sort((a, b) => {
    return dayjs(b, { format: "YYYY/MM" }).diff(
      dayjs(a, { format: "YYYY/MM" })
    );
  });

  let SUMMARY = "# SUMMARY\n\n";
  let lastGroup = "";
  for (let index = 0; index < groups.length; index++) {
    const group = groups[index];
    if (lastGroup !== group) {
      SUMMARY += `- [${group}](${group})\n`;
    }
    const contents = summaryContents[group];
    for (let j = 0; j < contents.length; j++) {
      const content = contents[j];
      SUMMARY += `  - ${content}\n`;
    }
    lastGroup = group;
  }

  writePromises.push(writeToFileSync("SUMMARY.md", SUMMARY));

  await Promise.all(writePromises);

  console.log("Done. Total discussions:", finalDiscussions.length);
}

main();
