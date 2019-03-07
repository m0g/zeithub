FROM node:10.15.1
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .
ENV NODE_ENV=production
RUN npm run build
RUN npm prune
EXPOSE 3000
CMD ["npm", "start"]