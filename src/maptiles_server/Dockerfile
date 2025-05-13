FROM node:current-alpine3.21

ENV PORT=3000

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ./src .

USER node

RUN npm install

EXPOSE ${PORT}

CMD [ "node", "server.js" ]