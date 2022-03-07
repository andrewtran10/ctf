FROM node:17

WORKDIR /app

COPY package.json ./
RUN npm install

ADD src ./src
ADD public ./public

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
