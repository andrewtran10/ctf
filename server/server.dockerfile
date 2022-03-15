FROM node:17

RUN apt-get update
RUN apt-get install ncat -y

RUN chmod +s /bin/gzip
RUN chmod +s /usr/bin/diff

RUN useradd -ms /bin/bash server
WORKDIR /home/server/app

COPY package.json ./
RUN npm install

ADD middleware ./middleware
ADD routes ./routes
ADD utils ./utils
ADD testing ./testing

COPY server.js ./
COPY db.js ./
COPY .env ./

COPY flag.txt ./

WORKDIR /home/server
COPY flag(1).txt ./

EXPOSE 5000
CMD ["npm", "start"]

