"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const usuarios_1 = __importDefault(require("./routes/usuarios"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("./classes/config"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const post_1 = __importDefault(require("./routes/post"));
const cors_1 = __importDefault(require("cors"));
const server = new server_1.default();
//Cofiguration CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
//middleware bodyparser
server.app.use(body_parser_1.default.urlencoded({ extended: true })); //application/x-www-form-urlencoded
server.app.use(body_parser_1.default.json());
//FileUpload
server.app.use(express_fileupload_1.default()); //{useTemFiles:true} en caso de problemas con jpeg o png
//uso de middleware para rutas
server.app.use('/user', usuarios_1.default);
server.app.use('/posts', post_1.default);
//Conectar db
mongoose_1.default.connect(`mongodb://${config_1.default.db_host}:${config_1.default.db_port}/${config_1.default.db_name}`, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (err) => {
    if (err)
        throw err;
});
//levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
