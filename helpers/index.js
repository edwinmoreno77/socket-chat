




const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jwt');
const googleVerify = require('./google-verify');
const uploadsFile = require('./upload-file');


module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleVerify,
    ...uploadsFile,
}