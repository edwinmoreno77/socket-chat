const { response } = require("express")


const isAdminRole = (req, res = response, next) => {

    if (!req.user) {
        return res.status(500).json({ msg: 'try to verify the role without authenticating the token' });
    }

    if (req.user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({ msg: `${req.user.name} is not admin - can't do this` });
    }

    next();
}

const allowedRole = (...roles) => {

    return (req, res = response, next) => {

        if (!req.user) {
            return res.status(500).json({ msg: 'try to verify the role without authenticating the token' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(401).json({ msg: `you need to have these roles: ${roles}` });
        }

        next();
    }

}


module.exports = {
    isAdminRole,
    allowedRole
}