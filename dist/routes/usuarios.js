"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const token_1 = __importDefault(require("../classes/token"));
const uthentication_1 = require("../middlewares/uthentication");
const userRoutes = express_1.Router();
userRoutes.post('/login', (req, res) => {
    const { body: cuerpo } = req;
    user_model_1.Usuario.findOne({ email: cuerpo.email }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'Usuario/contraseña no son correctos'
            });
        }
        if (userDB.comparePassword(cuerpo.password)) {
            const tokenUser = token_1.default.getJWtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });
            res.json({
                ok: true,
                token: tokenUser
            });
        }
        else {
            return res.json({
                ok: false,
                message: 'Usuario/contraseña no son correctos ***'
            });
        }
    });
});
userRoutes.post('/create', (req, res) => {
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt_1.default.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    };
    user_model_1.Usuario.create(user)
        .then(userDB => {
        const tokenUser = token_1.default.getJWtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }).catch(err => {
        res.json({
            ok: false,
            error: err.errmsg
        });
    });
});
userRoutes.get('/test', (req, res) => {
    res.json({
        ok: true,
        message: 'All function very well!'
    });
});
//ACtualizar user
userRoutes.post('/update', uthentication_1.tokenVerify, (req, res) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar
    };
    user_model_1.Usuario.findByIdAndUpdate(req.user._id, user, { new: true }, (err, userDB) => {
        if (err)
            throw err;
        if (!userDB) {
            return res.json({
                ok: false,
                message: 'User not exist'
            });
        }
        const tokenUser = token_1.default.getJWtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });
        res.json({
            ok: true,
            token: tokenUser
        });
    }); //new: true le dice a mongoose que devuelva la informacion actualizada
});
userRoutes.get('/', [uthentication_1.tokenVerify], (req, res) => {
    const { user } = req;
    res.json({
        ok: true,
        user
    });
});
exports.default = userRoutes;
