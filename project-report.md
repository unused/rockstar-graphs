
# Project Report

Rockstar Graphs represent a spatial-temporal data visualization to evaluate
fame. In particular it takes preprocessed time based data and aligns it on
a series of nodes and edges that are placed according to related geographical
information. The graph itself represents the tour of an artist and the data
represented by colourized points around the tour is feedback received, like
in the our case Twitter data collected.

## Twitter Client (Go)

Feedback data was collected over a timespan of a month using the Twitter API. A
command line client written in Go (https://golang.org) was used to search for
several keywords and store data collected into JSON encoded files. The
implementation was done using the Go programming language in order to benefit
from a powerful concurrency handling and compilation into binaries that can be
executed on many platform.

The client was used to collect twitter data for 25 different artists and was
running for a month on a notebook, a raspberry pi and later a server.

Please note that the Twitter API requires a registered project for
authorization. A free registration is possible, however the data retrieved is
limited to the last seven days and API requests are limited to a 450 within a
15 minutes time range.

## Tweet Database (ruby, MongoDB)

In order to pre-process the data a NoSQL database is used with a dynamic
schema. The data model is directly used by given attributes of the tweets
collected. Duplicates are simply ignored and the creation date is stored as
date time in order to allow queries on this field. Additionally the source is
kept to being able to relate the data to an artist. The tweet database provides
an export that extracts timestamps of the tweets of a specific artists together
with a sentiment score that is calculated using a rubygem.

## Visualizations (D3)

From manually collected tour data a graph is build. The event locations are
drawn as nodes relatively positioned by their geo coordinates. Consecutive
nodes are connected with edges. The visualization provides a native HTML select
field to switch between different artists. When an artist is selected, the
graph data is loaded and the tweet data fetched from a predefined source. A
histogram is presented including a interactive sliding window in order to
highlight a specific region in the time range. The Twitter data itself is
placed onto graph and edges by timestamp. Points on edges are placed based on
their relative position to the time. Points on nodes are clustered using a
attraction force simulation. Those points also represent the sentiment score
by a color scheme from negative red, neutral yellow to positive green.

