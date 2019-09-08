FROM node:12-alpine as assets-builder

RUN mkdir /app
WORKDIR /app
COPY package.json yarn.lock /app/
RUN yarn install && rm -rf /root/.cache/yarn
COPY webpack.config.js tslint.json tsconfig.json ./
COPY app/javascript ./app/javascript
RUN NODE_ENV=production node_modules/.bin/webpack

FROM ruby:2.6.4-slim

RUN apt-get update && apt-get install -y build-essential
RUN gem install bundler -v 1.17.3

RUN mkdir /app

COPY Gemfile Gemfile.lock /tmp/
RUN cd /tmp && bundle install -j4 --deployment --without 'development test' --path /gems

WORKDIR /app
COPY . /app

COPY --from=assets-builder /app/public/packs ./public/packs

CMD ["bin/rails", "c"]
