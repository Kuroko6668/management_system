FROM node
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app
COPY package*.json /app/
RUN npm i
COPY . /app
EXPOSE 4000
CMD BUILD_ENV=docker node server.js
