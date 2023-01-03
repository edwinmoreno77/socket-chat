const { response } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');


const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                msg: 'User does not exist - email'
            });
        }

        // Validate if user is active
        if (!user.state) {
            return res.status(400).json({
                msg: 'User does not exist - state: false'
            });
        }


        // Validate password
        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'User/password incorrect - password'
            });
        }


        // Create JWT Payload
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'contact admin'
        });
    }


}

const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {
        const { name, img, email } = await googleVerify(id_token);

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            const data = {
                name,
                email,
                password: '123456',
                img,
                role: 'USER_ROLE',
                google: true
            }
            user = new User(data);
            await user.save();
        }

        // if user state is false, then user is not active
        if (!user.state) {
            return res.status(400).json({
                msg: 'User does not exist - state: false, Please contact admin'
            });
        }

        // generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error, can not verify google token'
        });
    }


}


const revalidarToken = async (req, res = response) => {

    const { _id: uid, name, role, img, email } = req.user;

    // Generar JWT
    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        uid,
        name,
        role,
        img,
        email,
        token,
    })
}

module.exports = {
    login,
    googleSignIn,
    revalidarToken
};