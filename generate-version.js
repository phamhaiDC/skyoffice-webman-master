const fs = require('fs')

fs.readFile('src/version.json', 'utf-8', (err, data) => {
  if (err) throw err
  const versionData = JSON.parse(data)
  versionData.buildRevision += 1
  fs.writeFile('src/version.json', JSON.stringify(versionData), error => {
    if (error) throw error
  })
})
