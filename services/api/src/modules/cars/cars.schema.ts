import { AJVSchema } from '../../types';

export const carsSchema: AJVSchema = {
  title: 'AJV Schema for Car',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxItems: 100,
    },
    brand: {
      type: 'string',
      minLength: 3,
      maxItems: 50,
    },
    type: {
      type: 'string',
      enum: ['electric', 'hybrid', 'fuel']
    },
    color: {
      type: 'string',
    },
    fuelCapacity: {
      type: 'number',
    },
    mileage: {
      type: 'number',
    },
  },
  additionalProperties: false
};
