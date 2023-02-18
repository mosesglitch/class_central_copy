const fs = require("fs");
const path = require("path");

function addFilePathToHtmlFiles(rootPath, filePath) {
  // Get a list of all files and directories in the current folder
  const files = fs.readdirSync(rootPath);

  // Loop through each file or directory in the current folder
  files.forEach((file) => {
    const fullPath = path.join(rootPath, file);

    // If the current item is a directory, recursively call this function with the directory path
    if (fs.statSync(fullPath).isDirectory()) {
      addFilePathToHtmlFiles(fullPath, filePath);
    } else {
      // If the current item is an HTML file, add the relative filepath to the file
      if (path.extname(fullPath) === ".html") {
        const relativePath = path.relative(path.dirname(fullPath), filePath);
        const fileContent = fs.readFileSync(fullPath, "utf8");
        const updatedFileContent = fileContent.replace(
          "</head>",
          `<script src="${relativePath}" type="text/javascript"></script></head>`
        );
        fs.writeFileSync(fullPath, updatedFileContent, "utf8");
      }
    }
  });
}

// Call the function with the root folder path and the filepath you want to add
addFilePathToHtmlFiles("./classcentral", "./script.js");
