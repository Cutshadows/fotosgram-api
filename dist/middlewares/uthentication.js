"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("../classes/token"));
exports.tokenVerify = (req, res, next) => {
    const userToken = req.get('x-token') || '';
    token_1.default.compareToken(userToken)
        .then((decoded) => {
        req.user = decoded.user;
        next(); //puede continuar con el siguiente paso que el usuario queria ejecutar
    })
        .catch(err => {
        res.json({
            ok: false,
            message: 'Token its incorrect'
        });
    });
};
