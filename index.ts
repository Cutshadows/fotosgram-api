import Server from './classes/server';
import userRoutes from './routes/usuarios';
import mongoose, { mongo } from 'mongoose';
import config from './classes/config';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import postRoutes from './routes/post';
import cors from 'cors';
const server = new Server();

//Cofiguration CORS
server.app.use(cors({origin:true, credentials:true}));
//middleware bodyparser
server.app.use(bodyParser.urlencoded({extended:true})); //application/x-www-form-urlencoded
server.app.use(bodyParser.json());

//FileUpload
server.app.use(fileUpload()); //{useTemFiles:true} en caso de problemas con jpeg o png


//uso de middleware para rutas
server.app.use('/user', userRoutes);
server.app.use('/posts', postRoutes);




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