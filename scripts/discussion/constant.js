const DiscussionCategory = {
    ANNOUNCEMENTS: 'announcements',
    SHOWANDTELL: 'show-and-tell',
    DRAFT: 'draft',
}

const DiscussionAuthorAssociation = {
    OWNER: 'OWNER'
}

module.exports = {
    GITHUB_SERVER_URL: process.env.GITHUB_SERVER_URL,
    GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,

    Discussion: {
        Category: DiscussionCategory,
        AuthorAssociation: DiscussionAuthorAssociation
    }
}
