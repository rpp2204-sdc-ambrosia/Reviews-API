FROM newrelic/infrastructure:latest
ADD newrelic-infra.yml /etc/newrelic-infra.yml

FROM --platform=linux/amd64 node:16
# FROM node:16

RUN npm install -g nodemon

WORKDIR /Reviews-API

COPY package*.json ./

RUN npm install

ENV NEW_RELIC_NO_CONFIG_FILE=true \
  NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true \
  NEW_RELIC_LOG=stdout

COPY . .

EXPOSE 3000

CMD ./start.sh