FROM --platform=linux/amd64 node:16

WORKDIR /Reviews-API

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm","run","start"]