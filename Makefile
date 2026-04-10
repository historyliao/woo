NPM ?= npm
NODE ?= node
PACKAGE_NAME := $(shell $(NODE) -p "JSON.parse(require('fs').readFileSync('package.json','utf8')).name")
PACKAGE_VERSION := $(shell $(NODE) -p "JSON.parse(require('fs').readFileSync('package.json','utf8')).version")
TARBALL := $(PACKAGE_NAME)-$(PACKAGE_VERSION).tgz

.PHONY: deps install build pack verify clean

deps:
	$(NPM) install

build: deps
	$(NPM) run build

pack: build
	rm -f $(TARBALL)
	$(NPM) pack

install: pack
	$(NPM) install -g ./$(TARBALL)

verify: build
	$(NPM) run verify

clean:
	rm -rf dist $(TARBALL)
