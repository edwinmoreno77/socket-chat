const { response } = require("express");

const { Product } = require("../models");
const { Category } = require('../models');


// get all products
const getAllProducts = async (req, res = response) => {

    const { limit = 5, from = 0 } = req.query;
    const query = { state: true };

    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        total,
        products
    });
}

// get one product by id

const getProductById = async (req, res = response) => {

    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name role')
        .populate('category', 'name');

    if (!product.state) {
        return res.status(404).json({
            msg: 'Product not found'
        });
    }

    res.json(product);
}

// create product

const createProduct = async (req, res = response) => {

    const { name, user, ...body } = req.body;

    const data = {
        ...body,
        name: name.toUpperCase(),
        user: req.user._id,
    };
    const productDB = await Product.findOne({ name: data.name });

    if (productDB) {
        return res.status(400).json({
            msg: `Product ${name} already exists`
        });
    }

    const product = new Product(data);

    await product.save();

    res.status(201).json(product);
}

// update product

const updateProduct = async (req, res = response) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user._id;

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.json(product);
}

// delete product

const deleteProduct = async (req, res = response) => {

    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { state: false }, { new: true });

    res.json(product);
}


module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct
}