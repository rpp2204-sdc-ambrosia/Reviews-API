FROM node:12

WORKDIR /Reviews-API

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm","run","start"]