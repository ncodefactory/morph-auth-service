FROM node:10-alpine AS build
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY ./package.json .
COPY --chown=node:node . .
USER node
RUN npm install

FROM node:10-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/dist && chown -R node:node /home/node/app/dist
WORKDIR /home/node/app
COPY ./package-prod.json ./package.json
COPY --chown=node:node --from=build /home/node/app/dist ./dist
USER node
RUN npm install
RUN npm audit fix

CMD ["node", "./dist/app.js"]
