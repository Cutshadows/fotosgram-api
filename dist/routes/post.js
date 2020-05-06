"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uthentication_1 = require("../middlewares/uthentication");
const post_model_1 = require("../models/post.model");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = express_1.Router();
const fileSystem = new file_system_1.default();
//GET POSTS
postRoutes.get('/', [uthentication_1.tokenVerify], (req, res) => __awaiter(this, void 0, void 0, function* () {
    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1;
    skip = skip * 10;
    const posts = yield post_model_1.Post.find()
        .sort({ _id: -1 }) //ordenar de forma descendente
        .skip(skip)
        .limit(10) //limite de enviar 10 registros
        .populate('user', '-password') //mostrar informacion del usuario consultado con el post
        .exec();
    res.json({
        ok: true,
        pagina,
        posts
    });
}));
//CREATE POSTS
postRoutes.post('/', [uthentication_1.tokenVerify], (req, res) => {
    const { body: cuerpo } = req;
    cuerpo.user = req.user._id;
    const images = fileSystem.imagesTempToPost(req.user._id);
    cuerpo.imgs = images;
    post_model_1.Post.create(cuerpo).then((postDB) => __awaiter(this, void 0, void 0, function* () {
        yield postDB.populate('user', '-password').execPopulate(); //me trae todo los datos del usuario menos la password
        res.json({
            ok: true,
            post: postDB
        });
    })).catch(err => {
        res.json(err);
    });
});
//SERVICIO PAR SUBIR ARCHIVOS
postRoutes.post('/upload', [uthentication_1.tokenVerify], (req, res) => __awaiter(this, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'Dont upload any files'
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(404).json({
            ok: false,
            message: 'Dont upload any files'
        });
    }
    if (!file.mimetype.includes('image')) {
        return res.status(403).json({
            ok: false,
            message: 'Uploaded not an image'
        });
    }
    yield fileSystem.saveTemporalImages(file, req.user._id);
    res.json({
        ok: true,
        file: file.mimetype
    });
}));
postRoutes.get('/image/:userId/:img', [uthentication_1.tokenVerify], (req, res) => {
    const { userId } = req.params;
    const { img } = req.params;
    const pathPhoto = fileSystem.getPhotoURL(userId, img);
    res.sendFile(pathPhoto);
    /* res.json({
        userId,
        img
    }) */
});
exports.default = postRoutes;
