
require 'mongoid'
require 'json'

require_relative './mongoid.rb'
require_relative './models/tweet.rb'

FILES = Dir.glob '*.jsonl'
SOURCES = FILES.map { |filename| filename.delete_suffix '.jsonl' }
