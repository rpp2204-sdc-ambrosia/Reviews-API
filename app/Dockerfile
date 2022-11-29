FROM --platform=linux/amd64 node:16

ENV PORT=${PORT}
ENV REDIS_URL=${REDIS_URL}
ENV MONGODB_URI=${MONGODB_URI}

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm","run","start"]