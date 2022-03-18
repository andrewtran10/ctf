FROM node:17

RUN apt-get update
RUN apt-get install ncat -y
RUN useradd -ms /bin/bash web_tool
RUN usermod -aG node web_tool

RUN chmod +s /bin/gzip
RUN chmod +s /usr/bin/diff

WORKDIR /home/web_tool/app/server
COPY ./package.json ./
RUN npm install

ADD ./middleware ./middleware
ADD ./routes ./routes
ADD ./utils ./utils
ADD ./views ./views

COPY ./server.js ./
COPY ./db.js ./
COPY ./.env ./

# FLAGS
WORKDIR /home/web_tool/app
ADD ./flags ./flags
RUN chmod 000 ./flags/.sneaky_flag.txt

WORKDIR /home/web_tool/app/server
USER web_tool
EXPOSE 5000
CMD ["npm", "start"]
