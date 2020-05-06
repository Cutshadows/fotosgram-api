import { Schema, Document, model } from 'mongoose';
import moment from 'moment';

const postSchema=new Schema({
    created:{
        type:Date
    },
    message:{
        type:String
    },
    imgs:[{
        type:String
    }],
    coords:{
        type:String //-14,12312121, 12.45454546
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:[true, 'We need to exist a reference with to user']
    }
});

postSchema.pre<IPost>('save', function(next){ //es como un trigger que se dispara antes de la insercion en bd
    this.created=moment().format()
    next();
})


interface IPost extends Document{
    created:string,
    message:string,
    img:string[],
    coords:string,
    user:string
}

export const Post= model<IPost>('Post', postSchema);
