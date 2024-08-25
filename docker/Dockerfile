FROM node:alpine
COPY . /damas-core/
WORKDIR /damas-core/server-nodejs/
RUN npm install
RUN apk del openssl
VOLUME /data
WORKDIR /damas-core/server-nodejs/
EXPOSE 8090 8443
CMD ["node","."]
