"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@shankarregmi/common");
const user_controller_1 = require("./controllers/user.controller");
const amqpClient = new common_1.AMQPCLient();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield amqpClient.initialize({
        rpcQueue: {
            name: 'users',
            options: {
                durable: true,
            },
        },
    });
    common_1.logger.info({}, 'Users service started');
    yield amqpClient.registerRPCHandlers({
        rpcHandlers: {
            getUsers: user_controller_1.getUsers,
        },
    });
}))();
