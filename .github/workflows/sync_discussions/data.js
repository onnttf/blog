const dayjs = require('dayjs')
const { graphql } = require('@octokit/graphql')

const utc = require('dayjs/plugin/utc')

dayjs.extend(utc)

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
    fetchDiscussions: fetchDiscussions,
    publishDiscussion: publishDiscussion
}
