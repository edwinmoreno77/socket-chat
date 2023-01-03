const { response } = require("express");

const uploadFileValidator = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            msg: 'no files to upload - upload File validator'
        });
    }

    next();

}


module.exports = {
    uploadFileValidator
}