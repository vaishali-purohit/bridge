FROM node:13.12.0-alpine

RUN mkdir -p /app
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./
RUN npm install node-sass
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . /app

CMD ["npm", "start"]