import express from 'express';
export default class Server {
    app: express.Application;
    port: number;
    constructor();
    start(callback: () => void): void;
}
