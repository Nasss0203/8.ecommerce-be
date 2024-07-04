// dmbg
const { Schema, default: mongoose, model } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
let productSchema = new mongoose.Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_image: { type: [String], default: [''] },
    product_slug: String,
    product_quantity: { type: Number, required: true },
    product_category: { type: String, required: true, enum: ['Phones', 'Laptops', 'Tablets'] },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_auth: { type: Schema.Types.ObjectId, ref: 'Auth' },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (value) => Math.round(value * 10) / 10
    },
    product_varations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })

// Document middeware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true }) //Tạo slug
    next()
})

const phoneSchema = new Schema({
    phone_brand: { type: String, required: true },
    phone_ram: { type: Number, required: true },
    phone_screen: { type: Number, required: true },
    phone_data: { type: Number, required: true },
    product_auth: { type: Schema.Types.ObjectId, ref: 'Auth' },
}, {
    timestamps: true,
    collection: 'phones'
})

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    phone: model('Phones', phoneSchema)
}