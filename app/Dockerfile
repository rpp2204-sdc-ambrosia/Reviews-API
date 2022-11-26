FROM --platform=linux/amd64 node:16

RUN npm install -g nodemon

WORKDIR /Reviews-API

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ./start.sh