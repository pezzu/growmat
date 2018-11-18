FROM resin/raspberry-pi-alpine-node:8 as builder

WORKDIR /usr/src/app

COPY --from=auditimage /usr/src/audit ../audit
COPY package*.json bower.json .bowerrc ./
COPY ./conf ./conf

RUN npm install

COPY . ./

ENTRYPOINT ["npm", "start"]