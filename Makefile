
CMD=npm

all: build deploy

build:
	$(CMD) run build

deploy:
	$(CMD) run deploy

.PHONY: all build deploy
