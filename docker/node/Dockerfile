FROM node:10

RUN apt-get update && apt-get -y install netcat && apt-get clean

WORKDIR /app

COPY . /app/
COPY ./docker/entrypoint.sh /

EXPOSE 7001

RUN yarn install && yarn cache clean
RUN [ "chmod", "+x", "/entrypoint.sh"]

CMD ["/bin/bash"]

# ENTRYPOINT [ "yarn", "start" ]  