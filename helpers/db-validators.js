const { Role, User, Category, Product } = require('../models');


const isValidRole = async (role = '') => {
    const existsRole = await Role.findOne({ role });
    if (!existsRole) {
        throw new Error(`Role ${role} not exist`);
    }
}

const emailExists = async (email) => {

    const emailExist = await User.findOne({ email });

    if (emailExist) {
        throw new Error(`Email ${email} already exists`);
    }

}

const userExistsById = async (id) => {

    const idExist = await User.findById(id);

    if (!idExist) {
        throw new Error(`ID:${id} does not exist`);
    }

}

const categoryExistsById = async (id) => {

    const idExist = await Category.findById(id);

    if (!idExist) {
        throw new Error(`Category ID:${id} does not exist`);
    }

}

const productExistsById = async (id) => {

    const idExist = await Product.findById(id);

    if (!idExist) {
        throw new Error(`ID:${id} does not exist`);
    }

}

//validate collections
const validCollection = async (collection = '', collections = []) => {
    if (!collections.includes(collection)) {
        throw new Error(`Collection ${collection} not exist, only ${collections}`);
    }

    return true;
}

module.exports = {
    isValidRole,
    categoryExistsById,
    productExistsById,
    emailExists,
    userExistsById,
    validCollection
}