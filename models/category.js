const { Schema, model } = require('mongoose');
const User = require('./user');


const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },

    state: {
        type: Boolean,
        default: true,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

});

categorySchema.method('toJSON', function () {
    const { __v, _id, state, ...category } = this.toObject();
    let uid = _id;
    let orderCategory = Object.assign({ uid }, category);
    return orderCategory;
});

module.exports = model('Category', categorySchema);