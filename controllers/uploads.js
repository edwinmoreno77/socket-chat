const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");

const { uploadFile } = require("../helpers");
const { User, Product } = require('../models');

const fileUpload = async (req, res = response) => {

    try {
        //image file
        const name = await uploadFile(req.files, undefined, 'users');
        res.json({ name });

    } catch (msg) {
        res.status(400).json({ msg });
    }
}

const updateImage = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: 'User not found' });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: 'profuct not found' });
            }
            break;

        default:
            return res.status(500).json({ msg: `collection ${collection} not exist` });
    }

    // clean old image
    if (model.img) {
        const imagePath = path.join(__dirname, '../uploads/', collection, model.img);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

    const name = await uploadFile(req.files, undefined, collection);
    model.img = name;
    await model.save();
    res.json(model);
}


const updateImageClaudinary = async (req, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: 'User not found' });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: 'profuct not found' });
            }
            break;

        default:
            return res.status(500).json({ msg: `collection ${collection} not exist` });
    }

    // clean old image
    if (model.img) {
        const nameArr = model.img.split('/');
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.');
        // cloudinary.uploader.destroy(public_id);//delete image from cloudinary whitout folder
        cloudinary.uploader.destroy(`restServer/${collection}/${public_id}`);

    }

    const { tempFilePath } = req.files.file
    // const { secure_url } = await cloudinary.uploader.upload(tempFilePath);//upload image to cloudinary whitout folder
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, { folder: `restServer/${collection}` });

    model.img = secure_url;
    await model.save();
    res.json(model);
}

const showImage = async (req, res = response) => {

    const { id, collection } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({ msg: 'User not found' });
            }
            break;

        case 'products':
            model = await Product.findById(id);
            if (!model) {
                return res.status(400).json({ msg: 'profuct not found' });
            }
            break;

        default:
            return res.status(500).json({ msg: `collection ${collection} not exist` });
    }

    // clean old image
    if (model.img) {
        const imagePath = path.join(__dirname, '../uploads/', collection, model.img);
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        }
    }

    const placeholderPath = path.join(__dirname, '../assets/', 'placeholder.jpg');
    res.sendFile(placeholderPath);

}

module.exports = {
    fileUpload,
    updateImage,
    showImage,
    updateImageClaudinary
}