# docker-meXn-stack-example-app

## Description
This repository contains an API source code that build with NodeJS, ExpressJS, MongoDB, including integration and unit tests. The application running on Docker containers and ready to deploy any cloud provider.

## Unit test Results:
<img width="431" alt="Screen Shot 2022-01-18 at 22 55 46" src="https://user-images.githubusercontent.com/196202/150009137-5832880b-6481-4e8e-9f1b-128e322a8e1d.png">

## Integration Test Results:
<img width="432" alt="Screen Shot 2022-01-17 at 16 45 18" src="https://user-images.githubusercontent.com/196202/149780039-e41312c3-587c-4f45-83de-21e5c891cc42.png">

### Directory Structure:

```bash
.
├── Dockerfile.booking_manager
├── Dockerfile.restaurant_booking
├── LICENSE
├── README.md
├── coc-settings.json
├── db
│   └── mongodb
├── docker-compose.yml
├── dotenv-example
├── init-database-scripts
│   ├── 00-create-user.sh
│   ├── 01-init-schema.js
│   └── 02-fixtures.js
├── logs
├── package-lock.json
├── package.json
├── src
│   ├── booking_manager
│   │   ├── index.js
│   │   ├── init
│   │   │   ├── express.js
│   │   │   └── index.js
│   │   ├── routes
│   │   │   ├── index.js
│   │   │   ├── reservation.js
│   │   │   ├── restaurant.js
│   │   │   └── settings.js
│   │   └── services
│   │       ├── reservation.js
│   │       ├── reservation.test.js
│   │       ├── restaurant.js
│   │       └── restaurant.test.js
│   ├── commonlib
│   │   ├── config
│   │   │   ├── index.js
│   │   │   └── logger.js
│   │   ├── init
│   │   │   └── database.js
│   │   ├── lib
│   │   │   ├── APIError.js
│   │   │   └── APIResponse.js
│   │   ├── models
│   │   │   ├── reservation.js
│   │   │   └── restaurant.js
│   │   └── validators
│   │       └── sanitizer.js
│   └── restaurant_booking
│       ├── index.js
│       ├── init
│       │   ├── express.js
│       │   └── index.js
│       ├── routes
│       │   ├── index.js
│       │   └── restaurant.js
│       └── services
│           └── reservation.js
└── tests
    ├── booking_manager
    │   ├── reservation.test.js
    │   ├── restaurant.test.js
    │   └── settings.test.js
    ├── index.js
    ├── jest.setup.js
    └── restaurant_booking
```
As we see there are mandatory files like Dockerfile, package.json, docker-compose.yml etc.. 
- `db/mongodb` folder is the folder that is going to be mounted to the MongoDB docker container.
- `init-database-scripts` contains files like creating credentials for database, initializing schema validations and filling the DB with some fixtures that we are going to use during the integration test.
- `logs` folder is the place where we put our application error and debug logs.
- `src` folder is the place we store our microservice source code including unit tests. Currently we have 2 microsevices, called `booking_manager` and `restaurant_booking`.
- There is new folder called `commonlib`, I've moved only shared consistent files into this new folder to provide better DRY result. Only Mongoose schemas, common service initializers, configurations and Error/Response classes should live in this folder.
- There will be still duplicated service code, but to stay into DDD, we are accepting this a few duplicated lines. We should NOT move any business logic related lines into this `commonlib` folder.
- `src` folder is the place we store our microservice source code including unit tests. Currently we have 2 microsevices, called `booking_manager` and `restaurant_booking`.
- `tests` folder is the place where we put our integration tests, unit tests are living together with the main source files.

Please see `src/booking_manager/index.js` to see how we initialize our application.
After latest updates, now our repository support multiple microservice that using same `node_modules` folder and main configurations. We moved the files from `src` to `src/booking_manager` and created a new directory `src/restaurant_booking`.

I also created another docker file for our new microservice and make necessary changes in docker-compose and `dotenv-example` files as well.

To see the second microservice you need to visit [http://localhost:3001](http://localhost:3001) It's just example empty microservice contains only express/database/config initialization. 

## Start the application
First step is to install Docker to your computer.
Clone the repository and open your terminal. Go to the root folder and execute

```bash
$ cp dotenv-example .env
$ npm install
$ docker-compose up -d --build
```
Edit the .env file, wait for npm dependencies to install and then build the docker images.
Wait until you see something like:
```bash
Creating mongodb ... done
Creating mexn_booking_manager_1 ... done
```

Please execute `tail -f logs/debug*.log` to see debug logs of all the microservices. If everything goes right we should see something like below:
```bash

==> logs/debug.booking_manager.log <==
[2022-01-20T05:11:28.192] [INFO] default - Initializing services...
[2022-01-20T05:11:28.304] [INFO] default - √ Log4JS configured
[2022-01-20T05:11:28.304] [INFO] default - √ API ready
[2022-01-20T05:11:32.972] [INFO] default - √ MongoDB ready
[2022-01-20T05:11:32.975] [INFO] default - Booking Manager Services up & ready!
[2022-01-20T05:11:32.978] [INFO] default -
      === Booking manager server is ready on port 3000 ===


==> logs/debug.restaurant_booking.log <==
[2022-01-20T05:11:28.633] [INFO] default - Initializing services...
[2022-01-20T05:11:28.667] [INFO] default - √ Log4JS configured
[2022-01-20T05:11:28.667] [INFO] default - √ API ready
[2022-01-20T05:11:33.292] [INFO] default - √ MongoDB ready
[2022-01-20T05:11:33.293] [INFO] default - Restaurant Booking Services up & ready!
[2022-01-20T05:11:33.295] [INFO] default -
      === Restaurant Booking server is ready on port 3001 ===
```


Keep an eye on these log files during development and test can be helpful.

The application structure is similar to \*NIX systems. The services above started by the files under src/init folder. 
Each file is a service and initilazing before we open the HTTP Server.  

Please visit [http://localhost:3000/](http://localhost:3000/) to see if your API up and running.  

## Restart the application
We are using external docker volume to share the database with multiple containers.
If you made database related changes you will need to remove the files db/mongodb/ folder.

To stop all the containers, remove database and log files you can execute the command below:
```bash
docker-compose down && rm -rf ./db/mongodb/* && rm logs/*
```
Now if you start containers with `docker-compose up -d --build` command to see database related changes.

## Unit Tests
We have 2 type of tests, integration and unit tests.  
Execute the command below to proceed unit tests:  
```bash
$ docker-compose run booking_manager npm test -- --group=unit
```

## Integration Tests

The command below executes integration tests.  
```bash
$ docker-compose run booking_manager npm test -- --group=integration
```

#### Example Output:  
```bash
 PASS  tests/integration/restaurant.test.js (16.82 s)
  Restaurant
    ✓ GET main page (141 ms)
    ✓ GET restaurant details (201 ms)
    ✓ 500 Error on wrong restaurant ID (45 ms)
    ✓ 500 Error on invalid string (83 ms)

 PASS  tests/integration/settings.test.js (16.965 s)
  Restaurant Settings
    Working Hours
      ✓ Should update working hours of a restaurant (521 ms)
      ✓ Should return error 400 when invalid data posted (28 ms)
      ✓ Should return error 400 when string posted (15 ms)
    Tables
      ✓ Should add a table (43 ms)
      ✓ 400 Error when invalid data posted (22 ms)
      ✓ Should update a table (40 ms)
      ✓ Should be 400 response when invalid data putted (11 ms)

 PASS  tests/integration/reservation.test.js (19.183 s)
  Reservation Endpoint
    Create Reservation
      ✓ Should create a new reservation (193 ms)
      ✓ Should NOT allow past dates (20 ms)
      ✓ Should NOT allow future dates more than 1 year (16 ms)
      ✓ Should NOT allow reservations on the off day (18 ms)
      ✓ Should NOT allow reservations out of working hours (16 ms)
      ✓ Should NOT create reservation when invalid data posted (24 ms)
    Edit Reservation
      ✓ Should edit an existing reservation (33 ms)
      ✓ Should be 400 Error when invalid data putted (26 ms)

Test Suites: 3 passed, 3 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        20.922 s
Ran all test suites.
```

# Endpoints
We have standard responses for any kind of request:  
### Example OK Response:
```json
{
  "data": {...}
}
```
### Example Error Case:
```json
{
  "errors": [
    {
      "name": "APIError",
      "msg": "The seat capacity of this table is not enough for this reservation!",
      "details": {
          "table": "61dfb791e0205efb80f083ee",
          "capacity": 8,
          "requiredCapacity": 12
      }
    }
  ]
}
```
In integration tests, we are checking the data property and errors array.  

# Restaurant Booking Endpoints (Running on port 3001):
To get tables and availability of the tables, GET request to  [http://localhost:3001/api/restaurant/61d4b04efafc4eb99190c7c4/2022-02-05](http://localhost:3001/api/restaurant/61d4b04efafc4eb99190c7c4/2022-02-05)  

Please change the date at the and of the URL. To see different results, please test:
- a week day in next 10 days
- a sunday date in next 10 days
- a week day in next 30+ days
- an invalid date, like `2022-14-34`
#### Request
```bash
curl -H 'Content-Type: application/json' -X GET http://localhost:3001/api/restaurant/61d4b04efafc4eb99190c7c4/2022-02-05
```


# Booking Manager Endpoints (Running on port 3000)
## Restaurant:
To get restaurant details, GET [http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4](http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4)
```bash
curl -H 'Content-Type: application/json' -X GET http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4
```

## Settings:
To change working hours PUT to [http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/working-hours](http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/working-hours)

Use the curl command below to set the working hours of the restaurant.  
`hour` is the opening hour  
`day` [0-6], is the weekday, 1 monday, 2 tuesday, ..., 0 sunday  
`duration` Restaurant open time in minutes  
`open` in case of false, we ignore other parameters and set the restaurant is off for that day of the week.  

#### Request:
```bash
curl -H 'Content-Type: application/json' -X PUT -d '
[
  { "hour":9, "day":1, "duration":720, "open":true },
  { "hour":9, "day":2, "duration":720, "open":true },
  { "hour":9, "day":3, "duration":720, "open":true },
  { "hour":9, "day":4, "duration":720, "open":true },
  { "hour":9, "day":5, "duration":720, "open":true },
  { "hour":11, "day":6, "duration":600, "open":true },
  { "hour":11, "day":0, "duration":600, "open":false }
]' http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/working-hours
```


To add a new table POST to [http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables](http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables)

#### Request:
`name` is the table name, should be unique across the restaurant  
`smoking` bool, is smoking allowed?  
`outdoor` bool, is it a roof top or garden?  
`floor`  int  

```bash
curl -H 'Content-Type: application/json' -X POST -d '
{
   "name": "87",
   "smoking": false,
   "outdoor": true,
   "seat": 2,
   "floor": 2
}' http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables
```


To update a table PUT request to [http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables](http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables)

#### Request:
`_id` string  

```bash
curl -H 'Content-Type: application/json' -X PUT -d '
{
   "_id": "61dfb791e0205efb80f083ee",
   "name": "88",
   "smoking": false,
   "outdoor": true,
   "seat": 4,
   "floor": 2
}' http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables
```


## Reservation:
To create a new reservation POST to [http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/reservation](http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/reservation)

#### Request:
`name` string, a customer name,  
`phone` string, customer contact number,  
`time` string, the reservation time ISO date format (UTC timezone)  
`tableId` string  

```bash
curl -H 'Content-Type: application/json' -X POST -d '
{
   "name": "John Doe",
   "phone": "8764321819",
   "time":"2022-05-18T13:00:00.000Z",
   "people": 3,
   "tableId": "61dfb791e0205efb80f083ee"
}' http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/reservation
```

#### Request: 
To update a reservation PUT request to [http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/reservation](http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/reservation)

`_id`, string, the id of the reservation to apply changes  

```bash
curl -H 'Content-Type: application/json' -X PUT -d '
{
   "_id":"61d4b8308c8fa65750c50f66",
   "name": "John Doe",
   "phone": "8764321819",
   "time":"2022-06-18T13:00:00.000Z",
   "people": 5,
   "tableId": "61dfb791e0205efb80f083ee"
}' http://localhost:3000/api/restaurant/61d4b04efafc4eb99190c7c4/reservation
```
