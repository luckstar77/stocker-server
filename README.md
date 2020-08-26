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
docker run -it --rm -v ~/.ssh/:/root/.ssh/ -v $PWD:/app -p 7002:7002 -e "MONGODB_URI=mongodb://mongo:27017/stocker-stage" -e "PORT=7002" --net=stocker-server_backend stocker-server_node yarn dev
yarn
yarn dev
```