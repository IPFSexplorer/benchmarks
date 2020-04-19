import winston from "winston";
import { format } from "winston";

const { combine, timestamp, label, prettyPrint, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
    if (typeof message === "string" || (message as unknown) instanceof String) {
        return `${message}`;
    } else {
        return JSON.stringify(message);
    }
});

export const logger = winston.createLogger({
    level: "info",
    format: combine(myFormat),
    transports: [
        new winston.transports.File({ filename: "bench.log", tailable: false }),
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    ],
});

export function RunAsync(suite) {
    return new Promise(resolve => {
        suite.on("complete", function() {
            for (let i = 0; i < this.length; i++) {
                logger.info(`${this[i].hz}`);
            }
            resolve();
        });
        suite.run();
    });
}
