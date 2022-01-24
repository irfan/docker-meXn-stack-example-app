/**
 * Restaurant Service
 *
 * @group unit
 */
import {jest} from '@jest/globals';
import RestaurantService from './restaurant.js';
import Restaurant from '../../commonlib/models/restaurant.js';

describe('Restaurant Service', () => {

  beforeEach(() => {
    expect.hasAssertions();
    Restaurant.findOneAndUpdate = jest.fn(function() {
      return {
        lean: function() {
          return true;
        },
      };
    });
  });


  it('Should update working hours', async () => {
    const service = new RestaurantService();
    const restaurantId = '61d4b04efafc4eb99190c7c4';
    const data = [{
      hour: 11,
      duration:
      600, day: 1,
      open: true,
    }];
    const modelOptions = {upsert: false, returnDocument: 'after'};

    await service.updateWorkingHours(restaurantId, data);

    const params = Restaurant.findOneAndUpdate.mock.calls[0];

    expect(Restaurant.findOneAndUpdate).toHaveBeenCalled();
    expect(params[0]).toEqual({_id: restaurantId});
    expect(params[1]).toEqual({'workingHours': data});
    expect(params[2]).toEqual(modelOptions);
  });

  it('Should add a table', async () => {
    const service = new RestaurantService();
    const restaurantId = 1;
    const table = {
      name: 'my-table',
      smooking: false,
      outdoor: false,
      seat: 2,
      floor: 1,
    };

    const modelOptions = {
      upsert: false,
      returnDocument: 'after',
    };

    await service.addTable(restaurantId, table);
    const params = Restaurant.findOneAndUpdate.mock.calls[0];

    expect(Restaurant.findOneAndUpdate).toHaveBeenCalled();
    expect(params[0]).toEqual({
      '_id': restaurantId,
      'tables.name': {$ne: table.name},
    });
    expect(params[1]).toEqual({
      $push: {tables: table},
    });
    expect(params[2]).toEqual(modelOptions);
  });

});
