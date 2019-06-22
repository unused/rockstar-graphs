#!/usr/bin/env ruby

# extract.rb queries tweets by source and extracts the UTC timestamps into
# a single json encoded list. Results are stored into the current directory.
#
# Usage: ruby extract.rb

require_relative './application.rb'
require 'sentimental'

analyzer = Sentimental.new
analyzer.load_defaults

puts "#{Tweet.count} Tweets found in Database"

# Create an array of all timestamps and store into a json encoded file.
SOURCES.each do |source|
  tweets = Tweet.where(source: source).order_by created_at: :asc
  puts "#{tweets.count} Tweets for #{source} found"

  File.open("#{source}.json", 'w') do |file|
    file.puts tweets.pluck(:created_at, :text)
      .map { |ts, msg| { ts: ts.utc.to_i, sentiment: analyzer.sentiment(msg) } }.to_json
  end
end
