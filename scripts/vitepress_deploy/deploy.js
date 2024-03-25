const fs = require('fs').promises

async function mergeFiles(aFilePath, bFilePath) {
    try {
        // Read the content of file b
        const bData = await fs.readFile(bFilePath, 'utf8')

        // Split the content of file b by lines
        const bLines = bData.split('\n').slice(4) // Starting from the 5th line

        // Open file a in append mode, then write the content of file b line by line
        await fs.appendFile(aFilePath, bLines.join('\n'), 'utf8')

        console.log('Files merged successfully!')
    } catch (err) {
        console.error('Error occurred while merging files:', err)
    }
}

// Call the mergeFiles function with file paths
mergeFiles('index.md', 'README.md')
