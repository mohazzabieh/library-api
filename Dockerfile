FROM node:18-alpine

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

RUN apk update && apk add bash