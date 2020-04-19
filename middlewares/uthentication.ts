import {Response, Request, NextFunction} from 'express';
import Token from '../classes/token';

export const tokenVerify=(req:any, res:Response, next:NextFunction)=>{

    const userToken = req.get('x-token') || '';

    Token.compareToken(userToken)
    .then((decoded:any)=>{
        req.user=decoded.user;
        next();//puede continuar con el siguiente paso que el usuario queria ejecutar
    })
    .catch(err=>{
        res.json({
            ok:false,
            message:'Token its incorrect'
        })
    })

}