const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/validate-fields');

const { login, googleSignIn, revalidarToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/login', [
    check('email', 'email is require').isEmail(),
    check('password', 'password is require').not().isEmpty(),
    // check('password', 'password must contain more than 6 characters').isLength({ min: 6 }),
    validateFields
], login);

router.post('/google', [
    check('id_token', 'id_token is require').not().isEmpty(),
    validateFields
], googleSignIn);



router.get('/renew', validateJWT, revalidarToken);


module.exports = router;