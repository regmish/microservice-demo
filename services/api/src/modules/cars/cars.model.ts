import { Document, Schema, model } from 'mongoose';
export interface ICar extends Document {
  name: string;
  brand: string;
  type: 'electric' | 'hybrid' | 'fuel';
  color: string;
  fuelCapacity: number;
  mileage: number;
}

const CarSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['electric', 'hybrid', 'fuel'],
      default: 'fuel'
    },
    color: {
      type: String,
      required: true,
    },
    fuelCapacity: Number,
    mileage: Number,
  },
  { timestamps: true, versionKey: false }
);

export default model<ICar>('cars', CarSchema);
