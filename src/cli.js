#!/usr/bin/env node

const fs = require('fs');

const cheerio = require('cheerio');
const argv = require('yargs').argv;

/**
 * Returns the paragraph of text surrounding a link.
 */
function getContext($, link) {
  // I originally wrote this to pull link context from a Mailchimp HTML
  // archive page for a newsletter. The HTML does not wrap paragraphs in
  // `<p>` or `<div>` tags, so I have to traverse the DOM nodes to
  // get the text nodes that are the siblings of each link. Stop traversing
  // when we hit a break or heading tag.
  const stopSet = new Set(['br', 'h1', 'h2', 'h3', 'h4', 'h5']);
  const prevContext = [];
  const nextContext = [];
  let prev = link.previousSibling;
  let next = link.nextSibling;

  if (!prev && !next) {
    // No sibling. We must be inside a <span> tag. Get the text nodes adjacent
    // to that tag.
    return getContext($, link.parentNode);
  }

  while(prev && !stopSet.has(prev.tagName)) {
    prevContext.push($(prev).text());

    prev = prev.previousSibling;
  }

  while(next && !stopSet.has(next.tagName)) {
    nextContext.push($(next).text());

    next = next.nextSibling;
  }

  const context = prevContext
    .reverse()
    .concat([$(link).text()])
    .concat(nextContext)
    .join(' ')
    .replace(/ [.,]/g, ',')
    .replace(/\s+/g, ' ') 
    .trim();

  return context;
}

/**
 * Get preceding heading of link.
 */
function getHeading($, link) {
  return $(link).prevAll('h1,h2,h3,h4,h5').first().text();
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

  let $container;
  if (argv.container) {
    $container = $(argv.container);
  }
  else {
    $container = $('body');
  }

  const $links = $container.find('a');

  $links.each((i, link) => {
    const data = {
      url: $(link).attr('href'),
      link_text: $(link).text(),
      heading: getHeading($, link),
      context: getContext($, link),
    };
    console.log(JSON.stringify(data));
  });
}

main(argv);
