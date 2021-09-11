import { Model } from 'mongoose';
import { IApp } from '../../types';
import CarsModel, { ICar } from './cars.model';

export default class CarsService {
  private app: IApp;
  private Cars: Model<ICar>;

  constructor(app: IApp) {
    this.app = app;
    this.Cars = CarsModel;
  }

  async get(id: string): Promise<ICar> {
    return this.Cars.findById(id);
  }

  async find(): Promise<Array<ICar>> {
    return this.Cars.find();
  }

  async create(car: ICar): Promise<ICar> {
    return this.Cars.create(car);
  }

  async patch(id: string, car: Partial<ICar>): Promise<ICar> {
    await this.Cars.updateOne({ _id: id }, { $set: car });

    return this.get(id);
  }

  async delete(id: string): Promise<boolean> {
    const status = await this.Cars.deleteOne({ _id: id });

    if(status && status.deletedCount) return true;

    return false;
  }
}
