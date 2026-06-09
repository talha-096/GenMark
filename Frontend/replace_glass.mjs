import fs from "fs";
import path from "path";

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith(".tsx") || file.endsWith(".ts")) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles("d:/GenMark/Frontend/src");

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  
  let newContent = content;
  newContent = newContent.replace(/bg-white\//g, "bg-glass/");
  newContent = newContent.replace(/border-white\//g, "border-glass/");
  newContent = newContent.replace(/bg-black\//g, "bg-glass-inverse/");
  newContent = newContent.replace(/border-black\//g, "border-glass-inverse/");

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, "utf8");
    console.log("Updated", file);
  }
});

console.log("Done");
