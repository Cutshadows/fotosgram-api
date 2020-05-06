"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    ;
    saveTemporalImages(file, userId) {
        return new Promise((resolve, reject) => {
            //create folder
            const path = this.createFolderUser(userId);
            //create files
            const nameFile = this.generateName(file.name);
            //Move to the file upload to the folder temp
            file.mv(`${path}/${nameFile}`, (err) => {
                if (err) {
                    //todo mal
                    reject(err);
                }
                else {
                    //todo salio bien
                    resolve();
                }
            });
        });
    }
    generateName(originalName) {
        const nameArr = originalName.split('.');
        const extension = nameArr[nameArr.length - 1];
        const idUnique = uniqid_1.default();
        return `${idUnique}.${extension}`;
    }
    createFolderUser(userId) {
        const pathUser = path_1.default.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';
        const exist = fs_1.default.existsSync(pathUser);
        if (!exist) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    imagesTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPost = path_1.default.resolve(__dirname, '../uploads', userId, 'posts');
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesInTemp(userId);
        imagesTemp.forEach(image => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;
    }
    getImagesInTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, '../uploads', userId, 'temp');
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getPhotoURL(userId, img) {
        // Path POST
        const pathPhoto = path_1.default.resolve(__dirname, '../uploads', userId, 'posts', img);
        const exist = fs_1.default.existsSync(pathPhoto);
        if (!exist) {
            return path_1.default.resolve(__dirname, '../assets/original.jpg');
        }
        return pathPhoto;
    }
}
exports.default = FileSystem;
