FROM node:12.10.0-alpine
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Installs latest Chromium package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont

RUN apk --no-cache add g++ gcc libgcc libstdc++ linux-headers make python
RUN npm install --quiet node-gyp -g
RUN npm install

# Bundle app source
COPY . .
ENV NODE_ENV=production CHROME_BIN="/usr/bin/chromium-browser"
RUN npm run build
RUN npm prune
EXPOSE 3000
CMD ["npm", "start"]