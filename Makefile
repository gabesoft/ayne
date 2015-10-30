default: test

MOCHA = node_modules/.bin/mocha -u tdd --check-leaks
VERSION = $(shell node -pe 'require("./package.json").version')
BOWER = node_modules/.bin/bower
BROCCOLI = node_modules/.bin/broccoli
ESLINT = node_modules/.bin/eslint

all: test

.PHONY: release test loc clean no_targets__ help

no_targets__:
help:
	@sh -c "$(MAKE) -rpn no_targets__ | awk -F':' '/^[a-zA-Z0-9][^\$$#\/\\t=]*:([^=]|$$)/ {split(\$$1,A,/ /);for(i in A)print A[i]}' | grep -v '__\$$' | grep -v 'Makefile' | grep -v 'make\[1\]' | sort"

start:
	@mpr run ./mpr.json

run: start

link-jshintrc:
	@for i in `ls -d components/*/app`; do \
		ln -sv `pwd`/.jshintrc-client `pwd`/$$i/.jshintrc; \
	done;

link-jshintrc-clean:
	@for i in `ls -d components/*/app`; do \
		rm -v `pwd`/$$i/.jshintrc; \
	done;

serve:
	@node-dev server.js

serve-auth-assets:
	@cd components/auth && $(BROCCOLI) serve --port 4300

build:
	@rm -rf public && $(BROCCOLI) build 'public'

tag:
	@git tag -a "v$(VERSION)" -m "Version $(VERSION)"

tag-push: tag
	@git push --tags origin HEAD:master

test:
	@NODE_ENV=test $(MOCHA) -R spec test/*.js --grep @slow --invert

test-slow:
	@NODE_ENV=test $(MOCHA) -R spec test/*.js --grep @slow --timeout 10000

test-all:
	@NODE_ENV=test $(MOCHA) -R spec test/*.js --timeout 10000

jshint:
	@jshint .

eslint:
	@eslint .

loc:
	@find src/ -name *.js | xargs wc -l

setup: deps

deps: deps-npm deps-bower

deps-npm:
	@npm install . -d

deps-bower:
	@$(BOWER) install

clean-dep:
	@rm -rf node_modules
	@rm -rf bower_components

deploy: deps-npm
	@$(BOWER) install --allow-root
	@BROCCOLI_ENV=production rm -rf public && $(BROCCOLI) build 'public'
