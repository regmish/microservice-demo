import express, { Handler } from 'express';
import mongoose from 'mongoose';
import toArray from 'lodash/toArray';
import modules from './modules';
import * as mw from './middlewares';
import AMQPBroker from './lib/broker';

import { IApp } from './types';

require('dotenv').config();

class Application {
  public app: IApp;

  constructor() {
    this.app = express();
    this.app.set('PORT', process.env.PORT || 3000);
  }

  private async initMiddlewares(): Promise<void> {
    [
      express.urlencoded({ extended: true }),
      express.json(),
      mw.authenticate(this.app)
    ].forEach((middleware: Handler) => this.app.use(middleware));
  }

  private async initDb(): Promise<void> {
    const uri: string = process.env.MONGO_URI || 'mongodb://localhost:27017';
    const db: string = process.env.MONGO_DB || 'carBuilder';

    await mongoose.connect(`${uri}/${db}`, {
      promiseLibrary: global.Promise,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  private async initModules(): Promise<void> {
    const appModules: any = {};

    this.app.module = (name: string) => appModules[name];

    for (const Service of toArray(modules)) {
      if (typeof Service !== 'function') {
        throw new Error('Service instance needs to be a function or a class');
      }

      appModules[Service.name] = await Service(this.app);
    }

    this.app.use(mw.respond, mw.convert, mw.notFound, mw.handler);
  }

  public async bootstrap(): Promise<void> {
    await this.initMiddlewares();
    await this.initDb();
    await this.initModules();

    const AMQPChannel = await AMQPBroker();

    this.app.set('AMQPChannel', AMQPChannel)

    this.app.listen(this.app.get('PORT'), () => {
      console.log(`API running on port ${this.app.get('PORT')}`);
    });

    process.on('unhandledRejection', (reason: string) => {
      console.log('Unhandled Rejection', reason);
    });
  }
}

const app = new Application();
app.bootstrap();
