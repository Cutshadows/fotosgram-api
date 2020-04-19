import jwt from 'jsonwebtoken';

export default class Token{
    private static seed:string='cutshadows-sign-to-app-secret';
    private static expire:string='30d';

    constructor(){}

    static getJWtToken(payload:any):string{

        return jwt.sign({
            user:payload
        }, this.seed, {expiresIn:this.expire});
    }

    static compareToken(userToken:string){
        return new Promise((resolve, reject)=>{
            jwt.verify(userToken, this.seed, (err, decoded)=>{
                if(err){
                    //no confiar
                    reject();
                }else{
                    //token valido
                    resolve(decoded);
                }
            })
        });
    }
}