### Common Package For TypeScript

- #### AMQP Client (rabbitMQ Wrapper)
    - `initialize(optioins)`

        ```typescript
            const rabbitMQClient = new AMQPClient({});

            // Connect to rabbitMQ broker and creates a transmission channel
            rabbitMQClient.initialize();
         ```

    - `registerRPCHandlers(handlers: {})`

        ```typescript
            import { createUsers, getUsers } from "./userController";

            rabbitMQClient.registerRPCHandlers({
                createUsers,
                getUsers
            });
         ```

    
    - `callRPC({})`

        ```typescript
            rabbitMQClient.callRPC({
                targetQueue: 'users,
                procedure: 'getUsers',
                params: {
                    active: true,
                }
            });
         ```
