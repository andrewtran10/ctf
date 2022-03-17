FROM node:17

RUN apt-get update
RUN apt-get install ncat -y
RUN useradd -ms /bin/bash service
RUN usermod -aG node service

RUN chmod +s /bin/gzip
RUN chmod +s /usr/bin/diff


# FRONTEND
WORKDIR /home/service/app/client
COPY client/package.json ./
RUN npm install -g serve
RUN npm install

ADD client/src ./src
ADD client/public ./public

RUN npm run build


# BACKEND
WORKDIR /home/service/app/server
COPY server/package.json ./
RUN npm install

ADD server/middleware ./middleware
ADD server/routes ./routes
ADD server/utils ./utils

COPY server/server.js ./
COPY server/db.js ./
COPY server/.env ./

# FLAGS
WORKDIR /home/service/app
COPY flag.txt ./
COPY sneaky_flag.txt ./ 
COPY start.sh ./
RUN chmod 000 sneaky_flag.txt
RUN mv sneaky_flag.txt .sneaky_flag.txt

##RUN chown -R service:service /home/service

USER service
EXPOSE 3000 5000
CMD ["bash", "./start.sh"]
