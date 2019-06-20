
require_relative './application.rb'

puts "#{Tweet.count} Tweets found in Database"


def process(source)
  puts "Process #{source}, persist tweets to database"

  File.readlines("#{source}.jsonl").each do |row|
    JSON.parse(row)['statuses'].each do |tweet_data|
      Tweet.create! tweet_data.merge source: source
    rescue Mongo::Error::OperationFailure => e
      raise e unless e.to_s =~ /duplicate key error/
    end
  end
end

SOURCES.each { |source| process source }

puts "#{Tweet.count} Tweets found in Database"
