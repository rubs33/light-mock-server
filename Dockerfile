FROM node:10-alpine

LABEL maintainer "Rubens Takiguti Ribeiro <rubs33@gmail.com>"
LABEL project_name "light-mock-server"

RUN npm install -g light-mock-server

EXPOSE 3000

ENTRYPOINT ["lightmockserver"]
