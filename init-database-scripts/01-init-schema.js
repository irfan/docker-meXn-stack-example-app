db.createCollection("restaurants", {
  validator: {
    $jsonSchema: {
      title: "The list of companies using our systems",
      bsonType: "object",
      required: [ "name", "phone", "email" ],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        name: {
          bsonType: "string",
          description: "Restaurant name is required"
        },
        phone: {
          bsonType: "string",
          pattern: "^[0-9]{7,14}$",
          description: "Phone number is required"
        },
        email: {
          bsonType: "string",
          pattern: "^.+\@.+$",
          description: "Email address is required"
        },
        location: {
          bsonType: "object",
          required: [ "type", "coordinates" ],
          properties: {
            type: {
              bsonType: "string",
              "enum": ["Point"]
            },
            coordinates: {
              title: "Geo Coordinates",
              description: "The location of the restaurant",
              bsonType: "array",
              minItems: 2,
              maxItems: 2,
              items: [
                {
                  bsonType: "double",
                  minimum: -180,
                  maximum: 180
                },
                {
                  bsonType: "double",
                  minimum: -90,
                  maximum: 90
                }
              ]
            }
          }
        },
        address: {
          bsonType: "string",
        },
        workingHours: {
          bsonType: "array",
          minItems: 7,
          maxItems: 7,
          uniqueItems: true,
          items: {
            bsonType: "object",
            required: ["hour", "day", "duration", "open"],
            properties: {
              hour: {
                bsonType: "int",
                minimum: 0,
                maximum: 23,
                description: "hour must be an int between 0 to 23"
              }, 
              day: {
                bsonType: "int",
                minimum: 0,
                maximum: 6,
                description: "the day (weekday) must be an int between 0 to 6"
              }, 
              duration: {
                bsonType: "int",
                minimum: 0,
                maximum: 1440,
                description: "the duration (open duraiton) must be an int between 0 to 1440"
              }, 
              open: {
                bsonType: "bool"
              }
            }
          }
        },
        tables: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name", "smoking", "outdoor", "floor"],
            properties: {
              _id: {
                bsonType: "objectId"
              },
              name: {
                bsonType: "string"
              },
              smoking: {
                bsonType: "bool"
              },
              outdoor: {
                bsonType: "bool"
              },
              floor: {
                bsonType: "int"
              }
            }
          }
        }
      }
    }
  }
});

db.createCollection("reservations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [ "restaurantId", "name", "phone", "time", "tableId"],
      properties: {
        _id: {
          bsonType: "objectId"
        },
        name: {
          bsonType: "string"
        },
        phone: {
          bsonType: "string",
          pattern: "^[0-9]{7,14}$"
        },
        restaurantId: {
          bsonType: "objectId",
          description: "restaurant objectId is required in reservation"
        },
        time: {
          bsonType: "string",
          description: "Reservation date"
        },
        tableId: {
          bsonType: "objectId",
          description: "Reservation table id is required"
        }
      }
    }
  }
});

db.reservations.createIndex({ "restaurantId":1, "tableId":1, "time":1 }, { unique:true });

