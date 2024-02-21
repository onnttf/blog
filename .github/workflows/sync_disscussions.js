const { graphql } = require("@octokit/graphql");
const { promises: fs } = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);

const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

async function writeToFileSync(filePath, data) {
  try {
    const directory = path.dirname(filePath);
    await fs.mkdir(directory, { recursive: true });
    await fs.writeFile(filePath, data);
  } catch (error) {
    console.error(`Error writing file ${filePath}, error: ${error.message}`);
    throw error;
  }
}

async function fetchDiscussions(token, owner, repo, limit = 10) {
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
            discussions(first: $limit, after: $after, orderBy: {field: UPDATED_AT, direction: DESC}) {
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
      console.error(
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

async function main() {
  const [username, repoName] = GITHUB_REPOSITORY.split("/");

  console.log("Fetching discussions...");
  let allDiscussions = await fetchDiscussions(
    process.env.GITHUB_TOKEN,
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

  const DISCUSSION_CATEGORY_ANNOUNCEMENTS = "announcements";
  const DISCUSSION_CATEGORY_SHOWANDTELL = "show-and-tell";

  const categoryOrder = {
    [DISCUSSION_CATEGORY_ANNOUNCEMENTS]: 0,
    [DISCUSSION_CATEGORY_SHOWANDTELL]: 1,
  };

  const finalDiscussions = discussionMap.values();

  finalDiscussions.sort((a, b) => {
    const orderA = categoryOrder[a.category?.slug] || Number.MAX_SAFE_INTEGER;
    const orderB = categoryOrder[b.category?.slug] || Number.MAX_SAFE_INTEGER;

    return orderA - orderB;
  });

  if (finalDiscussions.length === 0) {
    return;
  }

  const writePromises = [];
  const readmeContents = [];
  const summaryContents = new Map();

  for (const v of finalDiscussions) {
    const jsonFilePath = `discussions/${year}/${month}/${v.number}_${v.id}.json`;

    writePromises.push(
      writeToFileSync(jsonFilePath, JSON.stringify(v, null, 2))
    );

    const createdAtInCST = dayjs(v.createdAt).utcOffset(8);
    const year = createdAtInCST.year();
    const month = createdAtInCST.month() + 1;

    const category = `${
      v.category?.emojiHTML
        ? v.category.emojiHTML.match(/>(.*?)</)?.[1] + " "
        : ""
    }${v.category?.name || ""}`;

    const labels = (v.labels?.nodes || [])
      .map((label) => label.name)
      .join(", ");

    const updatedAtInCST = dayjs(v.updatedAt).utcOffset(8);

    const metadata = {
      author: v.author?.login || '"-"',
      category: category || '"-"',
      labels: labels || '"-"',
      discussion: v.url || '"-"',
      updatedAt: `${updatedAtInCST.format()}` || '"-"',
    };

    const frontMatter = Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

    const markdownTitle = `# ${v.title.trim()}`;
    const markdownBody = v.body.trim();

    const markdownPath = `markdowns/${year}/${month}/${v.number}_${v.id}.md`;
    const markdownData = `---\n${frontMatter}\n---\n\n${markdownTitle}\n\n${markdownBody}\n`;

    writePromises.push(writeToFileSync(markdownPath, markdownData));

    const categoryInREADME = category
      ? `[${category}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/discussions/categories/${v.category?.slug}?discussions_q=)`
      : "";

    const labelsInREADME = (v.labels?.nodes || [])
      .map(
        (label) =>
          `[${label.name}](${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/discussions?discussions_q=label%3A${label.name})`
      )
      .join(", ");

    readmeContents.push([
      categoryInREADME || "-",
      `[${v.title}](${year}/${month}/${v.number}_${v.id}.md)`,
      labelsInREADME || "-",
      updatedAtInCST.format() || "-",
    ]);

    let key = `${year}/${month}`;
    if (a.category?.slug === DISCUSSION_CATEGORY_ANNOUNCEMENTS) {
      key = "announcements";
    }
    summaryContents.set(key, [
      ...(summaryContents.get(key) || []),
      `[${v.title}](${year}/${month}/${v.number}_${v.id}.md)`,
    ]);
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
  README += "![干货输出机](https://file.zhangpeng.site/wechat/qrcode.jpg)\n";

  writePromises.push(writeToFileSync("README.md", README));

  let SUMMARY = "# SUMMARY\n\n";

  let lastKey = "";

  summaryContents.forEach((value, key) => {
    if (lastKey !== key) {
      SUMMARY += `- [${key}](${key})\n`;
    }
    value.forEach((element) => {
      SUMMARY += `  - ${element}\n`;
    });
    lastKey = key;
  });

  writePromises.push(writeToFileSync("SUMMARY.md", SUMMARY));

  await Promise.all(writePromises);

  console.log("Done. Total discussions:", finalDiscussions.length);
}

main();
