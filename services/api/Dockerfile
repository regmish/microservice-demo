####################################################################
## STAGE 1
####################################################################
FROM node:18.12.1 as builder

WORKDIR /app

COPY ./package*.json /app/

RUN npm ci

COPY . /app/

RUN npm run build

####################################################################
## STAGE 2
####################################################################
FROM node:18.12.1-alpine3.16

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json

USER node

ENV NODE_ENV=production

# ENTRYPOINT [ "node", "/app/build/index" ]
