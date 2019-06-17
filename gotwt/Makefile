
CMD=go

all: build exec

build:
	$(CMD) build cmd/client.go -o bin/gotwt

exec:
	./bin/gotwt $(QUERY)

run:
	$(CMD) run cmd/client.go $(QUERY)

clean:
	rm -f *.jsonl

.PHONY: all build exec run clean
