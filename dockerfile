FROM node:14
WORKDIR /app
COPY package.json ./
RUN npm config set strict-ssl false
RUN npm install
COPY . .
EXPOSE 1337
CMD [ "node", "src/index.js" ]