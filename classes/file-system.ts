import { FileUpload } from '../interfaces/files-upload';
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';

export default class FileSystem{
    constructor(){};

    saveTemporalImages(file:FileUpload, userId:string){
        return new Promise((resolve, reject)=>{
            //create folder
            const path=this.createFolderUser(userId);

            //create files
            const nameFile=this.generateName(file.name);

            //Move to the file upload to the folder temp
            file.mv(`${path}/${nameFile}`, (err:any)=>{
                
                if(err){
                    //todo mal
                    reject(err);
                }else{
                    //todo salio bien
                    resolve();
                }
            })
        });
    }

    private generateName(originalName:string){
        const nameArr=originalName.split('.');
        const extension=nameArr[nameArr.length-1];

        const idUnique=uniqid();

        return `${idUnique}.${extension}`;


    }

    private createFolderUser(userId:string){
        const pathUser=path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp=pathUser+'/temp';

        const exist=fs.existsSync(pathUser);
        if(!exist){
            fs.mkdirSync(pathUser);
            fs.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }

    imagesTempToPost(userId:string){
        const pathTemp=path.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPost=path.resolve(__dirname, '../uploads', userId, 'posts');

        if(!fs.existsSync(pathTemp)){
            return [];
        }
        if(!fs.existsSync(pathPost)){
            fs.mkdirSync(pathPost);
        }
        
        const imagesTemp=this.getImagesInTemp(userId);
        imagesTemp.forEach(image=>{
            fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;          

    }
    private getImagesInTemp(userId:string){
        const pathTemp=path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readdirSync(pathTemp) || [];
    }

    getPhotoURL(userId:string, img:string){
        // Path POST
        const pathPhoto=path.resolve(__dirname, '../uploads', userId, 'posts', img);
        const exist=fs.existsSync(pathPhoto);
        if(!exist){
            return path.resolve(__dirname, '../assets/original.jpg');
        }
        return pathPhoto;
    }
}