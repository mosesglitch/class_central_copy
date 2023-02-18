const fs = require("fs");
const path = require("path");

// The folder containing the HTML files to modify
const folderPath = "./";

// The text to add to each HTML file
const textToAdd = `<script src="index.js" type="text/javascript"></script>`;

// The location in the HTML file to add the text to
const insertionPoint = `<script src="index.js" type="text/javascript"></script><head>`;

// Read the contents of each HTML file in the folder

// Recursively traverse the folder and its subfolders
function traverseFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Check if the file is a directory
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        if (stats.isDirectory()) {
          // Recursively traverse subfolders
          traverseFolder(filePath);
        } else if (path.extname(file) === ".html") {
          // Modify HTML files
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) throw err;

            // Find the location to insert the text
            const insertionIndex = data.indexOf(insertionPoint);

            if (insertionIndex !== -1) {
              // Insert the text at the specified location
              const modifiedData =
                data.slice(0, insertionIndex) +
                textToAdd +
                data.slice(insertionIndex);

              // Write the modified data back to the file
              fs.writeFile(filePath, modifiedData, (err) => {
                if (err) throw err;
                console.log(`Added text to ${filePath}`);
              });
            }
          });
        }
      });
    });
  });
}

traverseFolder(rootFolder);
