const jwt = require('jsonwebtoken');
const { response, request } = require('express');
const User = require('../models/user');


const validateJWT = async (req = request, res = response, next) => {

    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // read the user id to the request object
        const user = await User.findById(uid);

        if (!user) {
            return res.status(401).json({ msg: 'the user does not exist' });
        }

        // if the user is not found, return an error
        if (!user.state) {
            return res.status(401).json({ msg: 'User is not active' });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ msg: 'invalid token' });
    }

}


module.exports = {
    validateJWT
}