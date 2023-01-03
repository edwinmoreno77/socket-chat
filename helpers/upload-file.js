const path = require('path');
const { v4: uuidv4 } = require('uuid');


const uploadFile = (files, validExtensions = ['png', 'jpg', 'gif', 'jpeg'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const cutName = file.name.split('.');
        const fileExtension = cutName[cutName.length - 1];

        //validate file extension
        if (!validExtensions.includes(fileExtension)) {
            return reject(`${fileExtension} invalid file extension ${validExtensions}`)
        }

        const temporaryName = `${uuidv4()}.${fileExtension}`;
        const uploadPath = path.join(__dirname, '../uploads/', folder, temporaryName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(temporaryName);
        });

    });
}


module.exports = {
    uploadFile
};