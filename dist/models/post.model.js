"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const moment_1 = __importDefault(require("moment"));
const postSchema = new mongoose_1.Schema({
    created: {
        type: Date
    },
    message: {
        type: String
    },
    imgs: [{
            type: String
        }],
    coords: {
        type: String //-14,12312121, 12.45454546
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'We need to exist a reference with to user']
    }
});
postSchema.pre('save', function (next) {
    this.created = moment_1.default().format();
    next();
});
exports.Post = mongoose_1.model('Post', postSchema);
