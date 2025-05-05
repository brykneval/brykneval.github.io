import * as critical from 'critical';
import fs from 'fs';
import path from 'path';

// Specify the directory you want to scan
const siteDir = '_site/products';

// Function to recursively find all HTML files in a folder
function getHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    let htmlFiles = [];

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            htmlFiles = htmlFiles.concat(getHtmlFiles(fullPath)); // Recurse into subfolders
        } else if (file.endsWith('.html')) {
            htmlFiles.push(fullPath);
        }
    });

    return htmlFiles;
}

// Get all HTML files in _site
const htmlFiles = getHtmlFiles(siteDir);

// Inline critical CSS for each HTML file
htmlFiles.forEach(file => {
    critical.generate({
        src: file,
        base: siteDir,
        inline: true,
        width: 1140,
        height: 900
    }).then(() => {
        console.log(`Critical CSS inlined for: ${file}`);
    }).catch(err => {
        console.error(`Error processing ${file}:`, err);
    });
});
