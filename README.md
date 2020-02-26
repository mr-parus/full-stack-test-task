# full-stack-test-task
Full stack project.  Uploading .csv files with drag &amp; drop

Video sample:


[![web view](http://img.youtube.com/vi/MnY8Ko0pOC8/0.jpg)](http://www.youtube.com/watch?v=MnY8Ko0pOC8 "Step by step")


# Commands
[Front end](frontend) and [back end](server) aplications are almost independant, stored in different folders,
so some commands should be executed separately.

## If to run in containers: 
### Build and up all services from [docker-compose.yaml](docker-compose.yaml):

    docker-compose up --build -d

### Run tests:

- back-end tests:
```
   cd server
   npm run test:in_container
   # or
   docker-compose exec server sh -c 'cd /frontend && npm run test'
```
- front-end tests:
```
   cd frontend
   npm run test:in_container
   # or
   docker-compose exec server npm run test
```

## If to run localy: 
```
  # up mongodb if needed:
  docker-compose up --build -d mongo

  # at frontend dir:
  cd frontend 
  npm i 
  npm run test
  npm run build
  
  # at server dir:
  cd server
  npm i 
  npm run test
  npm run dev
```
# API
- Insert users by .csv file:
```
    POST /api/users/upload {FormData}
    Code: 200
    Response: {"data":{ fileName, insertedCount},"status":"OK"}
```

- Search users:
```
    GET /api/users/search?query=
    Code: 200
    Response: {"data":{users:[{...}]},"status":"OK"}
```



# Info

General info:
- Node.js version: `v13.6.0`. Using `ESM`
- All db data from each MongoDB instance will be mapped to `./mongo/data/` folder

Used ports:  
- `27017` - MongoDB server
- `3000`  - HTTP web server

MongoDB connection URL: 

    mongodb://admin:admin@localhost:27017/db

