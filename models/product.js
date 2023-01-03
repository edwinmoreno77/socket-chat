const { Schema, model } = require('mongoose');

const User = require('./user');
const Category = require('./category');


const productSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
    },

    state: {
        type: Boolean,
        default: true,
        required: true
    },

    price: {
        type: Number,
        default: 0,
    },

    description: {
        type: String,
    },

    available: {
        type: Boolean,
        default: true,
    },

    img: {
        type: String,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

productSchema.method('toJSON', function () {
    const { __v, _id, state, ...product } = this.toObject();
    let uid = _id;
    let orderProduct = Object.assign({ uid }, product);
    return orderProduct;
});

module.exports = model('Product', productSchema);