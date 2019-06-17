
# RockstarGraphs

A spatial-temporal data visualization to evaluate fame.

## Details

A demonstrational example of the project can be found at
[unused.github.io/rockstar-graphs/](https://unused.github.io/rockstar-graphs/).

To collect data a [go] twitter client [gotwt](/gotwt) is used to crawl data and
a [ruby] based data conversion script [tweetdb](/tweetdb) collects information
in a [mongodb] and preprocesses the tweets in order to be used by the
visualization frontend directly.

## Usage & Development

```sh
$ npm install # install dependencies
$ npm run start # start development webserver on http://localhost:8080
$ make # build
$ make deploy # deploy to GitHub pages
```

## Resources

- [latlong.net](https://www.latlong.net/) ... Find location geo coordinates.
- [d3indepth.com](https://www.d3indepth.com/) ... D3.js Tutorials

[go]: https://golang.org/ "The Go Programming Language"
[ruby]: https://www.ruby-lang.org/ "Ruby Programming Language"
[mongodb]: https://www.mongodb.com/ "MongoDB a document database"
