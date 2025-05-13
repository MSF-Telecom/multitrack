FROM node:current-alpine3.21

ENV GUI_PORT=8080
ENV GUI_WSS_PORT=8001
ENV PLUGIN_PORT=8081

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node ./src .

USER node

RUN npm install

EXPOSE ${GUI_PORT}
EXPOSE ${PLUGIN_PORT}

CMD [ "node", "server.js" ]