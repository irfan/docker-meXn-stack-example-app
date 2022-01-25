db.reservations.insertOne({
  _id: ObjectId('61d4b8308c8fa65750c50f66'),
  restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
  tableId: ObjectId('61dfb791e0205efb80f083ee'),
  name: 'Irfan Durmus',
  phone: '5327646161',
  people: NumberInt(4),
  time: '2022-01-14T14:00:00.000Z',
  updatedAt: ISODate('2022-01-17T02:35:24.327Z'),
  createdAt: ISODate('2022-01-17T02:35:24.327Z'),
});

function generateReservations(d) {
  if (d.getDay() === 0) {
    return;
  }
  db.reservations.insertMany([
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(1),
      time: new Date(d.setHours(d.getHours() + 1)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(3),
      time: new Date(d.setHours(d.getHours() + 1)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(4),
      time: new Date(d.setHours(d.getHours() + 2)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(2),
      time: new Date(d.setHours(d.getHours() + 1)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(8),
      time: new Date(d.setHours(d.getHours() + 2)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(6),
      time: new Date(d.setHours(d.getHours() + 1)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(4),
      time: new Date(d.setHours(d.getHours() + 1)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    },
    {
      _id: ObjectId(),
      tableId: ObjectId("61dfb791e0205efb80f083ee"),
      restaurantId: ObjectId('61d4b04efafc4eb99190c7c4'),
      name: "Irfan Durmus",
      phone: "5327646161",
      people: NumberInt(7),
      time: new Date(d.setHours(d.getHours() + 1)).toISOString(),
      updatedAt: new ISODate(),
      createdAt: new ISODate()
    }
  ]);
}

// create dummy reservations for tuesday
const date = new Date();
date.setMilliseconds(0);
date.setSeconds(0);
date.setMinutes(0);
date.setHours(0);
date.setDate(date.getDate() + 1); // book start from tomorrow


for (let i=0; i<11; i++) {
  date.setHours(9);  // after 9 am
  date.setDate(date.getDate() + 1);
  generateReservations(date);
}
