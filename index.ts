import Server from './classes/server';
import userRoutes from './routes/usuarios';
import mongoose, { mongo } from 'mongoose';
import config from './classes/config';
import bodyParser from 'body-parser';
const server = new Server();



//middleware bodyparser

server.app.use(bodyParser.urlencoded({extended:true})); //application/x-www-form-urlencoded
server.app.use(bodyParser.json());


//uso de middleware para rutas
server.app.use('/user', userRoutes);




//Conectar db
mongoose.connect(`mongodb://${config.db_host}:${config.db_port}/${config.db_name}`, {
   useNewUrlParser:true, 
   useCreateIndex:true 
}, (err)=>{
    if(err)throw err;
});


//levantar express
server.start(()=>{
    console.log(`Servidor corriendo en puerto ${server.port}`);
})