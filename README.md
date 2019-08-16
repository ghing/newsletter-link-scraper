# Scrape newsletter links

Scrape and compile links from an HTML rendering of a newsletter to build an archive of links. 

I originally wrote this to build an archive of links for my [newsletter about data in journalism](https://us19.campaign-archive.com/home/?u=b047d3bc2b6a5b8040972adb9&id=1fe84a1594).

Right now this only works for Mailchimp-based newsletter archives.

## Assumptions

- Node.js
- GNU Make
- ndjson-cli
- csvkit

## Installation

Clone the repository:

```
git clone https://github.com/ghing/newsletter-link-scraper.git
```

Install Node dependencies:

```
cd newsletter-link-scraper
npm install
```

## Building the archive CSV

Simply running `make` will download the newsletter archive, copies of the individual issues' HTML versions, scrape the links and output a CSV in `data/out/newsletter_links.csv`.

## Roadmap

- Create AppScript version to pull links from drafts so I can check if I've shared a link before.
