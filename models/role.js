const { Schema, model } = require('mongoose');

const RoleSchema = Schema({

    role: {
        type: String,
        required: [true, 'role is required']
    }
})


module.exports = model('Role', RoleSchema);