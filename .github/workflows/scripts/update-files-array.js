const fs = require('fs');
const path = require('path');

// Path to the data directory
const dataDir = path.join(__dirname, '../../../data');

// Path to the index.js file
const indexFilePath = path.join(__dirname, '../../../src/index.js');

// Read all .json files in the data directory
const dataFiles = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));

// Read the content of index.js
let indexFileContent = fs.readFileSync(indexFilePath, 'utf8');

// Extract the current files array
const filesArrayMatch = indexFileContent.match(/const files = \[(.*?)\];/s);
if (!filesArrayMatch) {
  console.error('Could not find the files array in index.js');
  process.exit(1);
}

// Parse the current files array
const currentFilesArray = JSON.parse(`[${filesArrayMatch[1]}]`);

// Find new files that are not in the current files array
const newFiles = dataFiles.filter(file => !currentFilesArray.includes(file));

// If there are new files, update the files array
if (newFiles.length > 0) {
  const updatedFilesArray = [...new Set([...currentFilesArray, ...newFiles])];
  const updatedFilesArrayString = `const files = ${JSON.stringify(updatedFilesArray, null, 2)};`;

  // Replace the old files array in index.js with the updated one
  indexFileContent = indexFileContent.replace(
    /const files = \[.*?\];/s,
    updatedFilesArrayString
  );

  // Write the updated content back to index.js
  fs.writeFileSync(indexFilePath, indexFileContent, 'utf8');
  console.log('Updated files array in index.js');
} else {
  console.log('No new files to add to the files array');
}