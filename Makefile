PATH := ./node_modules/.bin:$(PATH)
CLIENT := public
SERVER := app/server-bundle.js

build: $(CLIENT) $(SERVER)

$(CLIENT):
	BUNDLE=client NODE_ENV=production webpack --config ./webpack/prod.config.babel.js

$(SERVER):
	BUNDLE=server NODE_ENV=production webpack --config ./webpack/prod.config.babel.js

dev:
	nodemon -x babel-node -w ./server/index.js ./server/index.js & \
	babel-node ./server/dev-server.js & \
	wait

lint:
	eslint api app webpack dev-server.js

.PHONY: test
test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
    		--compilers js:babel-register \
    		--harmony \
    		--reporter spec \
    		--require should \
    		test/*.js

clean:
	rm -rf $(CLIENT) $(SERVER)

.PHONY: build dev lint test clean