
CMD=npm

build:
	$(CMD) run build

deploy:
	$(CMD) run deploy

report:
	pandoc -o project-report{.pdf,.md}

.PHONY: build deploy report
