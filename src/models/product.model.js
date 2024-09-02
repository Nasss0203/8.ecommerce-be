// dmbg
const { number } = require("joi");
const { Schema, default: mongoose, model } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
let productSchema = new mongoose.Schema(
	{
		product_name: { type: String, required: true },
		product_thumb: { type: String, required: true },
		product_description: { type: String },
		product_price: { type: Number, required: true },
		product_image: { type: [String], default: [""] },
		product_slug: String,
		product_quantity: { type: Number, required: true },
		product_category: {
			type: String,
			required: true,
			enum: ["phone", "laptop", "tablet"],
		},
		product_attributes: { type: Schema.Types.Mixed, required: true },
		product_auth: { type: Schema.Types.ObjectId, ref: "Auth" },
		product_ratingAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be above 1.0"],
			max: [5, "Rating must be above 5.0"],
			set: (value) => Math.round(value * 10) / 10,
		},
		product_varations: { type: Array, default: [] },
		isDraft: { type: Boolean, default: true, index: true, select: false },
		isPublished: {
			type: Boolean,
			default: false,
			index: true,
			select: false,
		},
	},
	{
		timestamps: true,
		collection: COLLECTION_NAME,
	},
);

//Create index for search
productSchema.index({ product_name: "text", product_description: "text" });
// const product = model(DOCUMENT_NAME, productSchema);

// Document middeware: runs before .save() and .create()
productSchema.pre("save", function (next) {
	this.product_slug = slugify(this.product_name, { lower: true }); //Tạo slug
	next();
});

// product.createIndexes();

const phoneSchema = new Schema(
	{
		brand: { type: String, required: true },
		ram: { type: String, required: true },
		screen: { type: String, required: true },
		storage_capacity: { type: String, required: true },
		product_auth: { type: Schema.Types.ObjectId, ref: "Auth" },
	},
	{
		timestamps: true,
		collection: "phones",
	},
);

const laptopSchema = new Schema(
	{
		brand: { type: String, required: true },
		ram: { type: String, required: true },
		screen: { type: String, required: true },
		ssd: { type: String, required: true },
		cpu: { type: String, required: true },
		product_auth: { type: Schema.Types.ObjectId, ref: "Auth" },
	},
	{
		timestamps: true,
		collection: "laptops",
	},
);

//Export the model
module.exports = {
	product: model(DOCUMENT_NAME, productSchema),
	phone: model("Phones", phoneSchema),
	laptop: model("Laptops", laptopSchema),
};
