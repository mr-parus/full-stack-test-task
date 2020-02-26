FROM node:13.6-alpine

WORKDIR /frontend
COPY ./frontend/package*.json ./
RUN npm i
COPY ./frontend ./
RUN npm run build

WORKDIR /server
COPY ./server/package*.json ./
RUN npm i
COPY ./server ./

ENTRYPOINT ["npm", "run"]
CMD ["start"]
