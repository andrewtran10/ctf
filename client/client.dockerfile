FROM node:17

RUN apt-get update

COPY package.json ./
RUN npm install -g serve
RUN npm install

ADD src ./src
ADD public ./public

RUN npm run build

EXPOSE 3000
CMD ["serve", "-s", "build"]
