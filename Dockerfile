FROM node:18.13.0-alpine3.16

RUN apk update && apk add --no-cache bash

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .

COPY docker/wait-for-it.sh /usr/wait-for-it.sh
RUN chmod +x /usr/wait-for-it.sh
