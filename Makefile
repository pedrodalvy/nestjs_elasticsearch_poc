setup:
	docker compose up -d es8
	docker compose up setup-app
	make down
.PHONY: setup

run:
	docker compose up -d es8 app
.PHONY: run

down:
	docker compose rm -f -s -v
.PHONY: run
