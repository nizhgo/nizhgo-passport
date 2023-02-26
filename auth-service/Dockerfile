FROM node:18.14.2-alpine3.17

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .


EXPOSE ${PORT}

RUN npm run build

# mirare database tables
CMD ["node", "build/src/database/migrate.js"]
CMD [ "node", "build/index.js" ]


