FROM node:17

COPY package.json ./
RUN npm install

ADD src ./src
ADD public ./public

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
