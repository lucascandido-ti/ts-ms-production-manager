FROM node:20

RUN apt update -y  && \
    apt install iputils-ping -y && \
    apt install procps -y && \
    yarn global add @nestjs/cli@9.0.0 -y

WORKDIR /home/node/app

COPY . .

RUN yarn --force --frozen-lockfile

RUN npx prisma generate

RUN yarn build

EXPOSE 6000

CMD [ "node", "dist/main.js" ]

