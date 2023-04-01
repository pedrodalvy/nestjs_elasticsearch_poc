setup-dev:
	ts-node src/commands/run.command setup
.PHONY: setup-dev

setup:
	npm run build
	node dist/commands/run.command setup
.PHONY: setup
