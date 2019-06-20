
CMD=ruby

all: convert extract

convert:
	$(CMD) convert.rb

extract:
	$(CMD) extract.rb

console:
	irb -r './application.rb'

clean:
	echo 'Tweet.delete_all' | ruby -r './application.rb'

.PHONY: all convert extract console clean
