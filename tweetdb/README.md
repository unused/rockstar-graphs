# Tweet Database

Some ruby scripts to populate a MongoDB with twitter data, execute a sentiment
analysis on tweets and export reduced data (timestamp, sentiment score).

## Usage

```
$ make # convert and extract
$ make convert # import all given *.jsonl files
$ make extract # export data to *.json files
$ make console # start interactive console to query data
$ make clean # clear database
```
