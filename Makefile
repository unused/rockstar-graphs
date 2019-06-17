
CMD=npm

all: build deploy

build:
	$(CMD) run build

deploy:
	git ci -m 'Deployment' dist/app.bundle.js && $(CMD) run deploy

.PHONY: all build deploy
