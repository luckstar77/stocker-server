### Build
```
docker-compose build --rm
```

### MongoDB
```
docker-compose up -d mongo
```

### Dev
```
docker run -it --rm -v ~/.ssh/:/root/.ssh/ -v $PWD:/app -p 7001:7001 -e "MONGO_HOST=mongo" -e "MONGO_DATABASE=stocker-stag" -e "PORT=7001" --net=stocker-server_backend stocker-server_node
yarn
yarn start
```