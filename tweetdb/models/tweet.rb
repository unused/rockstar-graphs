
class Tweet
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic

  field :source, type: String
  field :id_str, type: String
  field :created_at, type: DateTime

  index({ id_str: 1 }, { unique: true })
  index(created_at: 1)
end

Tweet.create_indexes # ensure indexes are set
