import { Router, Request, Response } from "express";
import { Usuario } from '../models/user.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { tokenVerify } from "../middlewares/uthentication";


const userRoutes=Router();


userRoutes.post('/login', (req:Request, res:Response)=>{
    const {body:cuerpo}=req;
    Usuario.findOne({email:cuerpo.email}, (err, userDB)=>{
        if(err)throw err;
        if(!userDB){
            return res.json({
                ok:false,
                message:'Usuario/contraseña no son correctos'
            });
        }

        if(userDB.comparePassword(cuerpo.password)){
            const tokenUser=Token.getJWtToken({
                _id:userDB._id,
                name:userDB.name,
                email:userDB.email,
                avatar:userDB.avatar
            });
            res.json({
                ok:true,
                token:tokenUser
            })
        }else{
            return res.json({
                ok:false,
                message:'Usuario/contraseña no son correctos ***'
            });
        }
    })
})
userRoutes.post('/create', (req:Request, res:Response)=>{
    const user={
        name    :req.body.name,
        email   :req.body.email,
        password:bcrypt.hashSync(req.body.password, 10),
        avatar  :req.body.avatar
    }
    Usuario.create(user)
    .then( userDB=>{
        const tokenUser=Token.getJWtToken({
            _id:userDB._id,
            name:userDB.name,
            email:userDB.email,
            avatar:userDB.avatar
        });
        res.json({
            ok:true,
            token:tokenUser
        })
    }).catch(err=>{
        res.json({
            ok:false,
            error:err.errmsg
        })
    })
    
})
userRoutes.get('/test', (req: Request, res: Response)=>{
    res.json({
        ok:true,
        message:'All function very well!'
    })
});

//ACtualizar user

userRoutes.post('/update', tokenVerify, (req:any, res:Response)=>{
    const user={
        name:req.body.name || req.user.name,
        email:req.body.email || req.user.email,
        avatar:req.body.avatar || req.user.avatar
    }
    Usuario.findByIdAndUpdate(req.user._id, user, {new:true}, (err, userDB)=>{
        if(err)throw err;
        if(!userDB){
            return res.json({
                ok:false,
                message:'User not exist'
            });
        }
        const tokenUser=Token.getJWtToken({
            _id:userDB._id,
            name:userDB.name,
            email:userDB.email,
            avatar:userDB.avatar
        });
        res.json({
            ok:true,
            token:tokenUser
        })
    })//new: true le dice a mongoose que devuelva la informacion actualizada
});


export default userRoutes;