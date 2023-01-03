const { Router } = require('express');
const { check } = require('express-validator');

const {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct } = require('../controllers/products');

const {
    validateJWT,
    validateFields,
    isAdminRole } = require('../middlewares');

const { categoryExistsById, productExistsById } = require('../helpers');


const router = Router();

//get all getAllproducts

router.get('/', getAllProducts);

//get one product by id - public route

router.get('/:id', [
    check('id', 'invalid id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields,
], getProductById);

// //create product - private - users with valaid token

router.post('/', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    check('category', 'category not is mongo id').isMongoId(),
    check('category').custom(categoryExistsById),
    validateFields
], createProduct);

// //update category - private - users with valaid token

router.put('/:id', [
    validateJWT,
    check('id').custom(productExistsById),
    check('category', 'category is required').not().isEmpty(),
    check('category').custom(categoryExistsById),
    validateFields,
], updateProduct);

// //delete category - private - only admin

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'invalid id').isMongoId(),
    check('id').custom(productExistsById),
    validateFields,
], deleteProduct);



module.exports = router;