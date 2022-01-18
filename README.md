# docker-meXn-stack-example-app

## Description
This repository contains an API source code that build with NodeJS, ExpressJS, MongoDB, including integration and unit tests. The application running on Docker containers and ready to deploy any cloud provider.

## Unit test Results:
<img width="431" alt="Screen Shot 2022-01-18 at 22 55 46" src="https://user-images.githubusercontent.com/196202/150009137-5832880b-6481-4e8e-9f1b-128e322a8e1d.png">

## Integration Test Results:
<img width="432" alt="Screen Shot 2022-01-17 at 16 45 18" src="https://user-images.githubusercontent.com/196202/149780039-e41312c3-587c-4f45-83de-21e5c891cc42.png">

### Directory Structure:

I'm going to tell a bit more about how the project structured. Please see the directory structure below:
```bash
.
├── Dockerfile
├── README.md
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
│   ├── config
│   │   ├── index.js
│   │   └── logger.js
│   ├── index.js
│   ├── init
│   │   ├── database.js
│   │   ├── express.js
│   │   └── index.js
│   ├── lib
│   │   ├── APIError.js
│   │   └── APIResponse.js
│   ├── middleware
│   │   └── sanitizer.js
│   ├── models
│   │   ├── reservation.js
│   │   └── restaurant.js
│   ├── routes
│   │   ├── index.js
│   │   ├── reservation.js
│   │   ├── restaurant.js
│   │   └── settings.js
│   └── services
│       ├── restaurant.test.js
│       └── restaurant.js
└── tests
    ├── index.js
    ├── integration
    │   ├── reservation.test.js
    │   ├── restaurant.test.js
    │   └── settings.test.js
    └── jest.setup.js
```
As we see there are mandatory files like Dockerfile, package.json, docker-compose.yml etc.. 
- `db/mongodb` folder is the folder that is going to be mounted to the MongoDB docker container.
- `init-database-scripts` contains files like creating credentials for database, initializing schema validations and filling the DB with some fixtures that we are going to use during the integration test.
- `logs` folder is the plase where we put our application error and debug logs.
- `src` folder is the place where we store our main source code, very clean solution.
- `tests` folder is the place where we put our tests, both integration and unit tests.

Please see src/index.js to see how we initialize our application.


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

Please go open `logs/debug.log`, if the application started succesifully you should see something like:
```bash
[2022-01-17T11:59:23.216] [INFO] default - Initializing services...
[2022-01-17T11:59:23.257] [INFO] default - √ Log4JS configured
[2022-01-17T11:59:23.257] [INFO] default - √ API ready
[2022-01-17T11:59:23.333] [INFO] default - √ MongoDB ready
[2022-01-17T11:59:23.333] [INFO] default - Services up & ready!
[2022-01-17T11:59:23.336] [INFO] default -
      === Booking manager server is ready on port 8080 ===
```


Keep an eye on this logs/debug.log file during development and test executions.

The application structure is similar to \*NIX systems. The services above started by the files under src/init folder. 
Each file is a service and initilazing before we open the HTTP Server.  

Please visit [http://localhost:8080/](http://localhost:8080/) to see if your API up and running.  

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
$ docker-compose run booking_manager npm test -- --group=integration
Creating mexn_booking_manager_run ... done

> booking_manager@1.0.0 test
> node --no-warnings --experimental-vm-modules node_modules/jest/bin/jest.js "--group=integration"

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
npm notice
npm notice New minor version of npm available! 8.1.2 -> 8.3.1
npm notice Changelog: https://github.com/npm/cli/releases/tag/v8.3.1
npm notice Run npm install -g npm@8.3.1 to update!
npm notice
```


## Endpoints

We have standard responses for any kind of request:  
#### OK Response:
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

### Restaurant:
GET [http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4](http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4)


### Settings:
To change working hours PUT to [http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/working-hours](http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/working-hours)

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
]' http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/working-hours
```


To add a new table POST to [http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables](http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables)

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
}' http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables
```


To update a table PUT request to [http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables](http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables)

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
}' http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/settings/tables
```


### Reservation:
To create a new reservation POST to [http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/reservation](http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/reservation)

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
}' http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/reservation
```

#### Request: 
To update a reservation PUT request to [http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/reservation](http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/reservation)

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
}' http://localhost:8080/api/restaurant/61d4b04efafc4eb99190c7c4/reservation
```
