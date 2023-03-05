FROM node:18-alpine

WORKDIR /app

COPY ./package.json ./package-lock.json .

RUN npm install

COPY src /app/src

RUN npm run server:build

ENTRYPOINT ["node", "dist/http.js"]
