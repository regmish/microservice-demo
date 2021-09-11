import {
  Router,
  IRouter,
  Request,
  NextFunction,
} from 'express';
import * as mw from '../../middlewares';
import { IApp, IResponse } from '../../types';
import { ICar } from './cars.model';
import CarService from './cars.service';
import { validate } from '../../middlewares/schema.middleware';
import { carsSchema } from './cars.schema';

async function CarsController(app: IApp): Promise<CarService> {
  const router: IRouter = Router();
  const service = new CarService(app);

  // Get all Cars
  router.get('/', async (req: Request, res: IResponse<Array<ICar>>, next: NextFunction): Promise<void> => {
    try {
      res.data =  await service.find();
      return next();
    } catch (error) {
      return next(error);
    }
  });

  // Get a single Car
  router.get('/:id', async (req: Request, res: IResponse<ICar>, next: NextFunction): Promise<void> => {
    try {
      res.data =  await service.get(req.params.id);
      return next();
    } catch (error) {
      return next(error);
    }
  });

  // Create new Car
  router.post('/', validate(carsSchema), async (req: Request, res: IResponse<ICar>, next: NextFunction): Promise<void> => {
    try {
      res.data = await service.create(req.body);
      return next();
    } catch (error) {
      return next(error);
    }
  });

  // Modify Car
  router.patch('/:id', validate(carsSchema), async (req: Request, res: IResponse<ICar>, next: NextFunction): Promise<void> => {
    try {
      res.data = await service.patch(req.params.id, req.body);
      return next();
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req: Request, res: IResponse<boolean>, next: NextFunction): Promise<void> => {
    try {
      res.data = await service.delete(req.params.id);
      return next();
    } catch (error) {
      return next(error);
    }
  });

  app.use('/cars', mw.requireAuth, router);

  return service;
}

export default CarsController;
