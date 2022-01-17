db.restaurants.insertOne({
  _id: ObjectId("61d4b04efafc4eb99190c7c4"),
  name:"My Super Restaurant For Integration tests",
  phone: "5327891212",
  email: "dinein@irfandurmus.com",
  location: {
    type: "Point",
    coordinates: [
      -13.2209,
      24.5671
    ]
  },
  address: "123 St. NY, 34742",
  workingHours: [
    { hour:NumberInt(9), day:NumberInt(1), duration:NumberInt(720), open:true },
    { hour:NumberInt(9), day:NumberInt(2), duration:NumberInt(720), open:true },
    { hour:NumberInt(9), day:NumberInt(3), duration:NumberInt(720), open:true },
    { hour:NumberInt(9), day:NumberInt(4), duration:NumberInt(720), open:true },
    { hour:NumberInt(9), day:NumberInt(5), duration:NumberInt(720), open:true },
    { hour:NumberInt(11), day:NumberInt(6), duration:NumberInt(600), open:true },
    { hour:NumberInt(11), day:NumberInt(0), duration:NumberInt(600), open:false }
  ],
  tables: [{
    _id: ObjectId("61dfb791e0205efb80f083ee"),
    name:"1",
    smoking:false,
    outdoor:false,
    floor: NumberInt(2),
    updatedAt: ISODate("2022-01-17T02:35:24.327Z"),
    createdAt: ISODate("2022-01-17T02:35:24.327Z")
  },
  {
    _id: ObjectId("61e1e7de87b59ee909bc576b"),
    name:"2",
    smoking:false,
    outdoor:true,
    floor: NumberInt(1),
    updatedAt: ISODate("2022-01-17T02:35:24.327Z"),
    createdAt: ISODate("2022-01-17T02:35:24.327Z")
  },
  {
    _id: ObjectId("61e1e7cc87b59ee909bc5763"),
    name:"3",
    smoking:true,
    outdoor:true,
    floor: NumberInt(1),
    updatedAt: ISODate("2022-01-17T02:35:24.327Z"),
    createdAt: ISODate("2022-01-17T02:35:24.327Z")
  }],
  createdAt : ISODate("2022-01-15T19:35:29.718Z"),
  updatedAt : ISODate("2022-01-15T19:35:29.718Z")
})

db.reservations.insertOne({
  _id: ObjectId("61d4b8308c8fa65750c50f66"),
  restaurantId: ObjectId("61d4b04efafc4eb99190c7c4"),
  tableId: ObjectId("61dfb791e0205efb80f083ee"),
  name: "Irfan Durmus",
  phone: "5327646161",
  time: "2022-01-14T14:00:00.000Z",
  updatedAt: ISODate("2022-01-17T02:35:24.327Z"),
  createdAt: ISODate("2022-01-17T02:35:24.327Z")
})
