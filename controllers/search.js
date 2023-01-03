const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const validCollection = [
    'users',
    'categories',
    'products',
];

const searchUsers = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);// true or false

    if (isMongoID) {
        const user = await User.findById(term);
        return res.json({
            results: (user) ? [user] : []
        })
    }

    const regex = new RegExp(term, 'i');

    const users = await User.find({
        $or: [{ name: regex }, { email: regex }, { role: regex }],
        $and: [{ state: true }]
    });
    const totalUsers = await User.count({
        $or: [{ name: regex }, { email: regex }, { role: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: {
            totalUsers,
            users
        }
    })
}

const searchCategory = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);// true or false
    // one category by id
    if (isMongoID) {
        const category = await Category.findById(term).populate('user', 'name');
        return res.json({
            results: (category) ? [category] : []
        })
    }

    const regex = new RegExp(term, 'i');
    // all categories
    const categories = await Category.find({
        $or: [{ name: regex }],
        $and: [{ state: true }]
    }).populate('user', 'name');
    // total categories
    const totalCategories = await Category.count({
        $or: [{ name: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: {
            totalCategories,
            categories
        }
    })
}

const searchProducts = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);// true or false
    // one product by id
    if (isMongoID) {
        const product = await Product.findById(term)
            .populate('user', 'name')
            .populate('category', 'name');

        return res.json({
            results: (product) ? [product] : []
        })
    }

    const regex = new RegExp(term, 'i');
    // all products
    const products = await Product.find({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ state: true }]
    }).populate('user', 'name')
        .populate('category', 'name');
    // total products
    const totalProducts = await Product.count({
        $or: [{ name: regex }, { description: regex }],
        $and: [{ state: true }]
    });

    res.json({
        results: {
            totalProducts,
            products
        }
    })
}

const search = (req, res = response) => {

    const { collection, term } = req.params;

    if (!validCollection.includes(collection)) {
        return res.status(400).json({
            message: `valid collections are ${validCollection}`
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategory(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            return res.status(500).json({
                message: `${collection} not implemented`
            });
    }
}

module.exports = {
    search
}