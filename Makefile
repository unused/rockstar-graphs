
CMD=npm

build:
	$(CMD) run build

deploy:
	$(CMD) run deploy

.PHONY: build deploy
