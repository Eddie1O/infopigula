FROM oven/bun:debian as deps

WORKDIR /myapp

COPY package.json .
COPY bun.lockb .

RUN bun i --frozen-lockfile

############################################
FROM deps as build
WORKDIR /myapp
ENV NODE_ENV production

COPY --from=deps /myapp/node_modules /myapp/node_modules
RUN apt-get update && apt-get install -y openssl
COPY . .
RUN bun run build

############################################
FROM node:20.10-slim
ENV NODE_ENV production

RUN apt-get update && apt-get install -y openssl

WORKDIR /myapp

COPY --from=build /myapp/node_modules ./node_modules

COPY --from=build /myapp/build/server ./build/server
COPY --from=build /myapp/build/client ./build/client
ADD . .

EXPOSE 3000

CMD ["npm", "run", "start"]
