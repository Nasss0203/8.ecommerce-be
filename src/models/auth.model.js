// dmbg
const { Schema, default: mongoose } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Auth'
const COLLECTION_NAME = 'Auth'
// Declare the Schema of the Mongo model
let authSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: [150, 'Name cannot exceed 150 characters'],
        minLength: [3, 'Name must be at least 3 characters long'],
        required: [true, 'Name is required']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Email is required'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters long']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, authSchema);