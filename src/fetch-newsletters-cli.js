#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const argv = require('yargs').argv;
const rp = require('request-promise');

/**
 * Returns a filename for a given title.
 */ 
function issueFilename(title) {
  const slug = title.toLowerCase()
      .replace(/[?#'?:'",]/g, '')
      .replace(/\s+/g, '_');

  return `${slug}.html`;
}

/**
 * Main body of program.
 */
function main(argv) {
  let inputs;
  const downloadDir = argv._[0];

  if (argv.file) {
    inputs = fs.createReadStream(argv.file);  
  }
  else {
    inputs = process.stdin  
  }

  const rl = readline.createInterface({
    input: inputs
  });

  rl.on('line', line => {
    const newsletterMeta = JSON.parse(line);
    const outputPath = path.join(
      downloadDir,
      issueFilename(newsletterMeta.title)
    );

    rp(newsletterMeta.url) 
      .then(html => {
        fs.writeFile(outputPath, html, (err) => {
          console.log(JSON.stringify({
            ...newsletterMeta,
            path: outputPath
          }));
        });
      });
  });
}

main(argv);
