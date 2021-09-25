import { Channel, connect, Connection } from 'amqplib';

let connection: Connection;
let channel: Channel;

export const connectToAMQPBroker = async (): Promise<Connection | boolean> => {
  if (connection) return connection;

  const username = process.env.BROKER_USERNAME;
  const password = process.env.BROKER_PASSWORD;

  try {
    connection = await connect({
      username,
      password,
    });

    connection.on('close', (error) => {
      console.log('Connectin to AMQP Broker closed abruptly, Exiting...', error.message);
    });

    return connection
  } catch (error) {
    console.log('Error establishing connectin to AMQP Broker ', error.message);
    process.exit(1);
  }
}

export default async () => {
  if (channel) return channel;

  const connection = await connectToAMQPBroker() as Connection;

  channel = await connection.createChannel();

  return channel;
}
