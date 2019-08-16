DATA_DIR := data
DATA_DIR_SRC := $(DATA_DIR)/src
DATA_DIR_TMP := $(DATA_DIR)/tmp
DATA_DIR_OUT := $(DATA_DIR)/out

NEWSLETTER_ARCHIVE_URL := https://us19.campaign-archive.com/home/?u=b047d3bc2b6a5b8040972adb9&id=1fe84a1594

NEWSLETTER_HTML_FILES = $(wildcard $(DATA_DIR_SRC)/newsletters/*.html)
NEWSLETTER_LINK_FILES = $(addprefix $(DATA_DIR_TMP)/newsletter_links/, \
	$(addsuffix .ndjson, $(basename $(notdir $(NEWSLETTER_HTML_FILES))))\
)

.PHONY: all

all: $(DATA_DIR_OUT)/newsletter_links.csv

$(DATA_DIR_OUT)/newsletter_links.csv: $(DATA_DIR_TMP)/newsletter_links.ndjson | $(DATA_DIR_OUT)
	in2csv -f ndjson $< > $@

$(DATA_DIR_TMP)/newsletter_links.ndjson: $(NEWSLETTER_LINK_FILES)
	cat $^ > $@

$(DATA_DIR_TMP)/newsletter_links/%.ndjson: $(DATA_DIR_SRC)/newsletters/%.html | $(DATA_DIR_TMP)/newsletter_links
	./src/cli.js --file $^ --container='tbody.mcnTextBlockOuter' \
	| ndjson-map 'd.source_file = "$(notdir $<)", d' \
	> $@

$(DATA_DIR_TMP)/newsletter_paths.ndjson: $(DATA_DIR_TMP)/newsletter_archive.ndjson | $(DATA_DIR_SRC)/newsletters
	./src/fetch-newsletters-cli.js \
	  --file data/tmp/newsletter_archive.ndjson \
	  data/src/newsletters \
	> $@

$(DATA_DIR_TMP)/newsletter_archive.ndjson: $(DATA_DIR_SRC)/newsletter_archive.html | $(DATA_DIR_TMP)
	./src/scrape-mailchimp-archive-cli.js --file $< > $@

$(DATA_DIR_SRC)/newsletter_archive.html: | $(DATA_DIR_SRC)
	wget -O $@ "$(NEWSLETTER_ARCHIVE_URL)" \
	&& touch $@

$(DATA_DIR_OUT):
	mkdir -p $@

$(DATA_DIR_TMP)/newsletter_links:
	mkdir -p $@

$(DATA_DIR_TMP):
	mkdir -p $@

$(DATA_DIR_SRC)/newsletters:
	mkdir -p $@

$(DATA_DIR_SRC):
	mkdir -p $@
