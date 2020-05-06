import { Router, Response } from 'express';
import { tokenVerify } from '../middlewares/uthentication';
import { Post } from '../models/post.model';
import { FileUpload } from '../interfaces/files-upload';
import FileSystem from '../classes/file-system';



const postRoutes=Router();
const fileSystem=new FileSystem();

//GET POSTS
postRoutes.get('/', [tokenVerify], async (req: any, res:Response)=>{
    
    let pagina=Number(req.query.pagina) || 1;
    let skip= pagina-1;
    skip=skip*10;

    const posts=await Post.find()
                    .sort({_id:-1}) //ordenar de forma descendente
                    .skip(skip)
                    .limit(10) //limite de enviar 10 registros
                    .populate('user', '-password')//mostrar informacion del usuario consultado con el post
                    .exec();
    
    res.json({
        ok:true,
        pagina,
        posts
    })
});


//CREATE POSTS
postRoutes.post('/', [tokenVerify], (req: any, res:Response)=>{
    const {body:cuerpo}=req;
        cuerpo.user=req.user._id;
    const images=fileSystem.imagesTempToPost(req.user._id);
    cuerpo.imgs=images;


    Post.create(cuerpo).then(async postDB=>{
        await postDB.populate('user', '-password').execPopulate();//me trae todo los datos del usuario menos la password
        res.json({
            ok:true,
            post:postDB
        });
    }).catch(err=>{
        res.json(err);
    })
    
    
    
    
    

});

//SERVICIO PAR SUBIR ARCHIVOS

postRoutes.post('/upload', [tokenVerify], async (req:any, res:Response)=>{
    if(!req.files){
        return res.status(400).json({
            ok:false,
            message:'Dont upload any files'
        });
    }
    const file:FileUpload=req.files.image;
    if(!file){
        return res.status(404).json({
            ok:false,
            message:'Dont upload any files'
        });
    }
    if(!file.mimetype.includes('image')){
        return res.status(403).json({
            ok:false,
            message:'Uploaded not an image'
        });
    }
    await fileSystem.saveTemporalImages(file, req.user._id);
    res.json({
        ok:true,
        file: file.mimetype
    });
});

postRoutes.get('/image/:userId/:img', [tokenVerify], (req:any, res:Response)=>{

    const {userId}=req.params;
    const {img}=req.params;

    const pathPhoto=fileSystem.getPhotoURL(userId, img);

    res.sendFile(pathPhoto);

    /* res.json({
        userId,
        img
    }) */
});



export default postRoutes;
