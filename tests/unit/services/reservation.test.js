/**
 * Unit test for the API Services
 *
 * @group unit
 */
import RestaurantService from '../../../src/services/restaurant.js';
import { jest } from '@jest/globals'
import Restaurant from '../../../src/models/restaurant.js';

// mock the necessary model functions
jest.mock('../../../src/models/restaurant.js', () => {
  findOneAndUpdate: () => {
    return {
      _id: 1,
      tables: []
    };
  };
});

describe('Restaurant Service', () => {

  // the service to be tested
  const service = new RestaurantService();

  it('Should add a table', async () => {
    const restaurantId = 1;
    const table = [{
      name: "my-table",
      smooking: false,
      outdoor: false,
      floor: 1
    }];
    const modelOptions = {
      upsert: false,
      returnDocument: 'after'
    };

    service.addTable(restaurantId, table).then(async (result) => {
      const params = Restaurant.findOneAndUpdate.mock.calls[0];
      expect(params[0]).toEqual({ _id: restaurantId });
      expect(params[1]).toEqual(table);
      expect(params[1]).toEqual(modelOptions);
    }).catch(e => console.error);
  });

  it('Should update working hours', async () => {
    const restaurantId = 1;
    const data = [{
      hour: 11,
      duration: 300,
      day: 3,
      open: true
    }];

    const modelOptions = {
      upsert: false,
      returnDocument: 'after'
    };

    service.updateWorkingHours(restaurantId, data).then(async (result) => {
      const params = Restaurant.findOneAndUpdate.mock.calls[0];
      expect(params[0]).toEqual({ _id: restaurantId });
      expect(params[1]).toEqual(data);
      expect(params[2]).toEqual(modelOptions);
    }).catch(e => console.error);

  });

});
