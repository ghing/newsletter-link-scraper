#!/usr/bin/env node

const fs = require('fs');

const cheerio = require('cheerio');
const argv = require('yargs').argv;

/**
 * Parse newsletter date from list entry text.
 */
function parseDate(entry) {
  const dateStrI = entry.search(/^\d{2}\/\d{2}\/\d{4}/);
  if (dateStrI === -1) {
    return null;
  }

  const dateStr = entry.slice(dateStrI, dateStrI + 10);
  const year = parseInt(dateStr.slice(6, 10), 10);
  const month = parseInt(dateStr.slice(0, 2), 10);
  const day = parseInt(dateStr.slice(3, 5));

  return `${year}-${month}-${day}`; 
}

/**
 * Parse newsletter title from list entry text.
 */
function parseTitle(entry) {
  return entry.split('-')[1].trim();
}

/**
 * Main body of program.
 */
function main(argv) {
  let html;

  if (argv.file) {
    html = fs.readFileSync(argv.file).toString();  
  }
  else {
    html = fs.readFileSync(0).toString();
  }

  const $ = cheerio.load(html);

  const $archiveList = $('#archive-list');

  $archiveList.find('.campaign').each((i, campaignEl) => {
    const $campaignEl = $(campaignEl);
    const campaign = {
      date: parseDate($campaignEl.text()),
      title: parseTitle($campaignEl.text()),
      url: $campaignEl.find('a').first().attr('href')
    };

    console.log(JSON.stringify(campaign));
  });
}

main(argv);
