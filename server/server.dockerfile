FROM node:17

RUN apt-get update
RUN apt-get install python3 -y
RUN apt-get install python3-pip -y
RUN apt-get install python3-dev libpq-dev -y
RUN apt-get install ncat -y

WORKDIR /app

COPY package.json ./
COPY requirements.txt ./
RUN pip install -r requirements.txt
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

