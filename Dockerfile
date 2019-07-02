FROM node:10-alpine as builder

WORKDIR /opt/prb0t
# Handle dependencies first, so they're cached
ADD ./package.json /opt/prb0t/package.json
ADD ./package-lock.json /opt/prb0t/package-lock.json
RUN npm install

ADD . /opt/prb0t
RUN npm run build

FROM node:10-alpine

WORKDIR /opt/prb0t
ADD ./package.json /opt/prb0t/package.json
ADD ./package-lock.json /opt/prb0t/package-lock.json
RUN npm install --production
COPY --from=builder /opt/prb0t/dist/micro.js /opt/prb0t/dist/micro.js

CMD ["npm", "run", "start"]