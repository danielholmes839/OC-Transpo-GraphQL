FROM node:10
WORKDIR /usr/octranspo-graphql
COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build
COPY .env ./dist
WORKDIR ./dist

EXPOSE 3000
CMD node server.js