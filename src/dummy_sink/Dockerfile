FROM node:current-alpine3.21

ENV LISTEN_PORT=8000

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

# COPY package*.json ./

USER node

# RUN npm install

COPY --chown=node:node ./src .

EXPOSE ${LISTEN_PORT}

CMD [ "node", "server.js" ]