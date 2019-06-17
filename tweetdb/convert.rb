
require_relative './application.rb'

puts "#{Tweet.count} Tweets found in Database"

source = ARGV.last

File.readlines("#{source}.jsonl").each do |row|
  JSON.parse(row)['statuses'].each do |tweet_data|
    Tweet.create! tweet_data.merge source: 'test'
  rescue Mongo::Error::OperationFailure => e
    raise e unless e.to_s =~ /duplicate key error/
  end
end

puts "#{Tweet.count} Tweets found in Database"
