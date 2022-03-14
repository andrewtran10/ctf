FROM node:17

RUN apt-get update
RUN apt-get install ncat -y

WORKDIR /app

COPY package.json ./
RUN npm install

ADD middleware ./middleware
ADD routes ./routes
ADD utils ./utils
ADD testing ./testing

COPY server.js ./
COPY db.js ./
COPY .env ./

EXPOSE 5000
CMD ["npm", "start"]

