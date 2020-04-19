import express from 'express';
import config from './config';


export default class Server{
    public app: express.Application;
    public port: number=config.PORT;

    constructor(){
        this.app=express();
    }

    start( callback: ()=>void){
        this.app.listen(this.port, callback);
    }
}