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

COPY server.js ./
COPY db.js ./
COPY .env ./

COPY flag.txt ./
COPY sneaky_flag.txt ./

RUN chmod 000 sneaky_flag.txt
RUN mv sneaky_flag.txt .sneaky_flag.txt
RUN mv flag.txt .sneaky_flag.txt /home/server/

RUN chown server:server /home/server

USER server
EXPOSE 5000
CMD ["npm", "start"]

