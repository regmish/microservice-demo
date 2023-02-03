import pino from "pino";
import pretty from "pino-pretty";

export default pino(pretty({
    ignore: "pid,hostname",
    translateTime: "yyyy-mm-dd HH:MM:ss",
}));
