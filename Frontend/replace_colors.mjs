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
  
  let lines = content.split('\n');
  let newLines = lines.map(line => {
    let newLine = line;
    // Replace text-white/opacity with text-foreground/opacity
    newLine = newLine.replace(/text-white\/(\d+)/g, "text-foreground/$1");
    // Replace bg-black with bg-background (only whole word)
    newLine = newLine.replace(/\bbg-black\b/g, "bg-background");
    
    // Replace text-white with text-foreground ONLY IF not on a line with a colored button background
    if (!newLine.includes("bg-red") && !newLine.includes("bg-primary") && !newLine.includes("bg-green") && !newLine.includes("bg-blue")) {
      newLine = newLine.replace(/\btext-white\b/g, "text-foreground");
    }

    return newLine;
  });

  const newContent = newLines.join('\n');

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, "utf8");
    console.log("Updated colors in", file);
  }
});

console.log("Finished text color script.");
